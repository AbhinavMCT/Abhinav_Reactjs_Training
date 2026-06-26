import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import api from "../interceptor.ts";

const requestUse = vi.fn();
const responseUse = vi.fn();

const instance = {
  interceptors: {
    request: {
      use: requestUse,
    },
    response: {
      use: responseUse,
    },
  },
  post: vi.fn(),
};

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => instance),
    post: vi.fn(),
  },
}));

describe("Axios Interceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("adds Authorization header when token exists", async () => {
    localStorage.setItem("accessToken", "token123");

    const handler =
      (api.interceptors.request as any).handlers[0].fulfilled;

    const config = {
      headers: {},
    };

    const result = handler(config);

    expect(result.headers.Authorization).toBe(
      "Bearer token123",
    );
  });

  it("does not add Authorization header when token is missing", () => {
    const handler =
      (api.interceptors.request as any).handlers[0].fulfilled;

    const config = {
      headers: {},
    };

    const result = handler(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it("returns response unchanged", () => {
    const response = {
      data: {
        name: "John",
      },
    };

    const handler =
      (api.interceptors.response as any).handlers[0].fulfilled;

    expect(handler(response)).toEqual(response);
  });

  it("refreshes token when access token expires", async () => {
    localStorage.setItem("refreshToken", "refresh");

    vi.mocked(axios.post).mockResolvedValue({
      data: {
        accessToken: "new-token",
      },
    } as any);

    const apiSpy = vi
      .spyOn(api, "request")
      .mockResolvedValue({} as any);

    const handler =
      (api.interceptors.response as any).handlers[0].rejected;

    const error = {
      response: {
        status: 403,
      },
      config: {
        headers: {},
      },
    };

    await handler(error);

    expect(localStorage.getItem("accessToken")).toBe(
      "new-token",
    );

    expect(apiSpy).toHaveBeenCalled();
  });

  it("clears storage when refresh token fails", async () => {
    vi.mocked(axios.post).mockRejectedValue(
      new Error("Refresh failed"),
    );

    const clearSpy = vi.spyOn(
      localStorage,
      "clear",
    );

    Object.defineProperty(globalThis, "location", {
      writable: true,
      value: {
        href: "",
      },
    });

    const handler =
      (api.interceptors.response as any).handlers[0].rejected;

    const error = {
      response: {
        status: 403,
      },
      config: {
        headers: {},
      },
    };

    await expect(handler(error)).rejects.toThrow();

    expect(clearSpy).toHaveBeenCalled();
    expect(globalThis.location.href).toBe("/login");
  });
});