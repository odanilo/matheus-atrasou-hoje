describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to visit home", () => {
    cy.visitAndCheck("/");
  });
});
