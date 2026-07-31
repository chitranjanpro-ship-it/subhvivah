describe('Brand switcher', () => {
  it('rotates the homepage brand between English and Hindi', () => {
    cy.visit('/');

    cy.get('[data-testid="brand-switcher-header"]')
      .should('have.attr', 'data-brand-variant', 'en')
      .and('contain.text', 'SubhVivah');

    cy.wait(4500);

    cy.get('[data-testid="brand-switcher-header"]')
      .should('have.attr', 'data-brand-variant', 'hi')
      .and('contain.text', 'शुभविवाह');
  });

  it('stays visible and usable on mobile screens', () => {
    cy.viewport(390, 844);
    cy.visit('/');

    cy.get('[data-testid="brand-switcher-header"]')
      .should('be.visible')
      .and('contain.text', 'SubhVivah');

    cy.contains('Join').should('be.visible');
  });
});
