import { TokenBalance, Transaction, WalletOverview } from "../types/solana";

const RPC_URL = "https://api.mainnet-beta.solana.com";
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const LAMPORTS_PER_SOL = 1_000_000_000;
const RECENT_TRANSACTION_LIMIT = 10;

type RpcError = {
  message: string;
};

type RpcResponse<T> = {
  result: T;
  error?: RpcError;
};

type BalanceResponse = {
  value: number;
};

type TokenAccountResponse = {
  value: Array<{
    account: {
      data: {
        parsed: {
          info: {
            mint: string;
            tokenAmount: {
              uiAmount: number | null;
            };
          };
        };
      };
    };
  }>;
};

type SignatureResponse = Array<{
  signature: string;
  blockTime: number | null;
  err: unknown;
}>;

const rpc = async <T>(method: string, params: unknown[]): Promise<T> => {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });

  const json = (await response.json()) as RpcResponse<T>;

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.result;
};

export const getBalance = async (address: string) => {
  const result = await rpc<BalanceResponse>("getBalance", [address]);
  return result.value / LAMPORTS_PER_SOL;
};

export const getTokens = async (address: string): Promise<TokenBalance[]> => {
  const result = await rpc<TokenAccountResponse>("getTokenAccountsByOwner", [
    address,
    { programId: TOKEN_PROGRAM_ID },
    { encoding: "jsonParsed" },
  ]);

  return result.value
    .map(({ account }) => ({
      mint: account.data.parsed.info.mint,
      amount: account.data.parsed.info.tokenAmount.uiAmount ?? 0,
    }))
    .filter((token) => token.amount > 0);
};

export const getTransactions = async (
  address: string,
): Promise<Transaction[]> => {
  const result = await rpc<SignatureResponse>("getSignaturesForAddress", [
    address,
    { limit: RECENT_TRANSACTION_LIMIT },
  ]);

  return result.map((signature) => ({
    sig: signature.signature,
    time: signature.blockTime,
    ok: !signature.err,
  }));
};

export const getWalletOverview = async (
  address: string,
): Promise<WalletOverview> => {
  const [balance, tokens, txns] = await Promise.all([
    getBalance(address),
    getTokens(address),
    getTransactions(address),
  ]);

  return { balance, tokens, txns };
};
