import subject from 'ComponentUtils.es6'

describe("ComponentUtils test",() => {
  it("should concatenate class names", ()=>{
    expect(subject.classes("foo", "bar")).toEqual("foo bar");
  });
});
