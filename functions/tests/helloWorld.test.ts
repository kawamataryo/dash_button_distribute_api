import 'jest';
import { helloWorld } from "../src";
import * as functions from 'firebase-functions-test';
functions();

describe("helloWorld func", () => {
  test('Hello from Firebase!を返す', () => {
    const req = {};
    const res = {
      send: (payload: any) => {
        expect(payload).toBe('Hello from Firebase!');
      },
    };
    helloWorld(req as any, res as any);
  });
});
