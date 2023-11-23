import { web3, utils, BorshCoder, Idl } from "@coral-xyz/anchor";
import { decodeIdlAccount, idlAddress } from "@coral-xyz/anchor/dist/cjs/idl";
import { BunFile } from "bun";
import { Command, Option } from "commander";
import { inflate } from "pako";
import * as util from "util";

const DEFAULT_RPC_URL = "https://api.mainnet-beta.solana.com/";

const idlOption = new Option("--idl <file>", "IDL file")
  .argParser(toFile)
  .conflicts("program");

const programOption = new Option("--program <PUBKEY>", "progam ID")
  .argParser(toPubkey)
  .conflicts("idl");

const urlOption = new Option("--url <URL>", "URL for Solana's JSON RPC")
  .default(new web3.Connection(DEFAULT_RPC_URL), DEFAULT_RPC_URL)
  .argParser(toConnection);

const program = new Command();

program
  .command("events <b64strings...>")
  .addOption(programOption)
  .addOption(idlOption)
  .addOption(urlOption)
  .action(decodeEvents);

program
  .command("accounts <pubkeys...>")
  .addOption(idlOption)
  .addOption(urlOption)
  .action(decodeAccounts);

program.parse();

function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw error;
  }
}

function toFile(str: string): BunFile {
  const file = Bun.file(str);
  if (!file.exists()) {
    console.log(`File "${str}" doesn't exist`);
    process.exit(1);
  }
  return file;
}

function toPubkey(str: string): web3.PublicKey {
  try {
    return new web3.PublicKey(str);
  } catch (err: unknown) {
    assertIsError(err);
    console.log(`Invalid pubkey "${str}": ${err.message}`);
    process.exit(1);
  }
}

function toConnection(str: string): web3.Connection {
  try {
    return new web3.Connection(str);
  } catch (err: unknown) {
    assertIsError(err);
    console.log(`Invalid URL "${str}": ${err.message}`);
    process.exit(1);
  }
}

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

interface EventsOpts {
  idl?: BunFile;
  program?: web3.PublicKey;
  url: web3.Connection;
}

async function decodeEvents(events: string[], opts: EventsOpts) {
  let idl: Idl;
  if (opts.idl) {
    idl = await opts.idl.json();
  } else if (opts.program) {
    const conn = opts.url;
    const programId = opts.program;
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

interface AccountsOpts {
  idl?: BunFile;
  url: web3.Connection;
}

async function decodeAccounts(accounts: string[], opts: AccountsOpts) {
  accounts.forEach((acc) => toPubkey(acc));

  const conn = opts.url;
  const pubkeys = accounts.map((a) => new web3.PublicKey(a));
  const infos = await opts.url.getMultipleAccountsInfo(pubkeys);
  const programIds = infos.map((x) => x.owner);

  let idls: Map<web3.PublicKey, Idl>;
  if (opts.idl) {
    const idl = await opts.idl.json();
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
