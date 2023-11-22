import { web3, utils, BorshCoder, Idl } from "@coral-xyz/anchor";
import { decodeIdlAccount, idlAddress } from "@coral-xyz/anchor/dist/cjs/idl";
import { inflate } from "pako";
import { Command } from "commander";
import * as util from "util";

const idlOption = {
  flag: "--idl <file>",
  description: "IDL file",
};

const urlOption = {
  flag: "--url <string>",
  description: "URL for Solana's JSON RPC",
  default: "https://api.mainnet-beta.solana.com/",
};

const program = new Command();

program
  .command("events <strings...>")
  .option(idlOption.flag, idlOption.description)
  .option("--program <string>", "program IDL to fetch the idl from")
  .option(urlOption.flag, urlOption.description, urlOption.default)
  .action(decodeEvents);

program
  .command("accounts <strings...>")
  .option(idlOption.flag, idlOption.description)
  .option(urlOption.flag, urlOption.description, urlOption.default)
  .action(decodeAccounts);

program.parse();

function valuesToString(obj: object) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value) {
      if (value.toString !== Object.prototype.toString) {
        obj[key] = Array.isArray(value)
          ? value.map((x) => valuesToString(x))
          : value.toString();
      } else {
        obj[key] = valuesToString(value);
      }
    }
  }
  return obj;
}

function toString(obj: object): string {
  return util.inspect(obj, {
    depth: null,
    maxArrayLength: null,
    maxStringLength: null,
  });
}

async function fetchIdls(
  conn: web3.Connection,
  programIds: web3.PublicKey[],
): Promise<Map<web3.PublicKey, Idl>> {
  const addresses = await Promise.all(programIds.map((x) => idlAddress(x)));
  const accInfos = await conn.getMultipleAccountsInfo(addresses);

  const idls = new Map();
  for (let i = 0; i < accInfos.length; ++i) {
    const info = accInfos[i];
    if (info) {
      const idlAccount = decodeIdlAccount(info.data.slice(8));
      const inflatedIdl = inflate(idlAccount.data);
      const idl = JSON.parse(utils.bytes.utf8.decode(inflatedIdl));
      idls.set(programIds[i], idl);
    }
  }

  return idls;
}

async function decodeEvents(events, options, _command) {
  let idl: Idl;
  if (options.idl) {
    idl = await Bun.file(options.idl).json();
  } else if (options.program) {
    const conn = new web3.Connection(options.url);
    const programId = new web3.PublicKey(options.program);
    const idlMap = await fetchIdls(conn, [programId]);
    idl = idlMap.get(programId);
  } else {
    console.log("error: missing required argument --program or --idl");
    process.exit(1);
  }

  const results = {};
  const coder = new BorshCoder(idl);
  events.forEach((event) => {
    const decoded = coder.events.decode(event);
    results[event] = decoded ? valuesToString(decoded) : null;
  });

  console.log(toString(results));
}

async function decodeAccounts(accounts, options, _command) {
  const conn = new web3.Connection(options.url);
  const pubkeys = accounts.map((a) => new web3.PublicKey(a));
  const infos = await conn.getMultipleAccountsInfo(pubkeys);
  const programIds = infos.map((x) => x.owner);

  let idls: Map<web3.PublicKey, Idl>;
  if (options.idl) {
    const idl = await Bun.file(options.idl).json();
    idls = new Map(programIds.map((x) => [x, idl]));
  } else {
    idls = await fetchIdls(conn, programIds);
  }

  const results = {};
  infos.forEach((info, indx) => {
    const idl = idls.get(programIds[indx]);
    const coder = new BorshCoder(idl);
    const decoded = coder.accounts.decodeAny(info.data);
    results[accounts[indx]] = decoded ? valuesToString(decoded) : null;
  });

  console.log(toString(results));
}
