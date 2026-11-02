import { formatCompactIndian, formatINR, formatIndianMobile, formatIndianNumber, isValidIndianMobile, normalizeIndianMobile, savingPercent } from "../src/format.js";

describe("formatINR", () => {
  it("groups in lakhs and crores, whole rupees by default", () => {
    expect(formatINR(280)).toBe("₹280");
    expect(formatINR(124999)).toBe("₹1,24,999");
    expect(formatINR(12345678)).toBe("₹1,23,45,678");
  });
  it("shows paise only when asked", () => {
    expect(formatINR(299.5, { paise: true })).toBe("₹299.50");
    expect(formatINR(299.5)).toBe("₹300");
  });
});

describe("Indian numbers", () => {
  it("groups without currency", () => expect(formatIndianNumber(2140000)).toBe("21,40,000"));
  it("shortens with K, L and Cr, never M or B", () => {
    expect(formatCompactIndian(950)).toBe("950");
    expect(formatCompactIndian(2140)).toBe("2.1K");
    expect(formatCompactIndian(150000)).toBe("1.5L");
    expect(formatCompactIndian(23000000)).toBe("2.3Cr");
  });
});

describe("Indian mobile numbers", () => {
  it("accepts pasted numbers in any format", () => {
    expect(normalizeIndianMobile("+91 98765-43210")).toBe("9876543210");
    expect(normalizeIndianMobile("09876543210")).toBe("9876543210");
    expect(normalizeIndianMobile("919876543210")).toBe("9876543210");
  });
  it("formats the way people say them", () => expect(formatIndianMobile("9876543210")).toBe("98765 43210"));
  it("validates 10 digits starting 6–9", () => {
    expect(isValidIndianMobile("98765 43210")).toBe(true);
    expect(isValidIndianMobile("5876543210")).toBe(false);
    expect(isValidIndianMobile("98765")).toBe(false);
  });
});

describe("savingPercent", () => {
  it("rounds down so we never over-promise", () => {
    expect(savingPercent(350, 280)).toBe(20);
    expect(savingPercent(299, 199)).toBe(33);
  });
  it("is 0 when there's no saving", () => expect(savingPercent(100, 120)).toBe(0));
});
