import { parse } from "../lib";

function getParser(code) {
  return () => parse(code, { sourceType: "module" });
}

describe("error filtering syntax", function() {
  it("should parse current syntax", function() {
    expect(getParser(`function a(){ try{} catch(e) {} }`)()).toMatchSnapshot();
  });
  it("should parse optional catch binding", function() {
    expect(getParser(`try{} catch {}`)()).toMatchSnapshot();
  });
  it("should parse new syntax", function() {
    expect(getParser(`try{} catch(Error, e) {}`)()).toMatchSnapshot();
  });
  it("should parse mix of new and old syntax", function() {
    expect(
      getParser(`try{} catch(Error, e) {} catch(f) {}`)(),
    ).toMatchSnapshot();
  });
  it("should parse new syntax in function", function() {
    expect(
      getParser(`function a(){try{} catch(Error, e) {}}`)(),
    ).toMatchSnapshot();
  });
  it("should parse new syntax with multiple filters", function() {
    expect(
      getParser(
        `function a(){try{} catch(Error, e) {} catch(TypeError, f) {}}`,
      )(),
    ).toMatchSnapshot();
  });
  it("should not parse new syntax with clashes", function() {
    expect(() =>
      getParser(`try{} catch(Error, e) {} catch(Error, f){}`)(),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      getParser(`try{} catch(Error, e) {} catch(TypeError, e){}`)(),
    ).toThrowErrorMatchingSnapshot();
  });
});
