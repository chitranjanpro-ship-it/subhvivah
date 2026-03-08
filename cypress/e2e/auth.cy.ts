describe('Authentication Flow', () => {
  it('should navigate to login page from landing page', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to register page from landing page', () => {
    cy.visit('/');
    cy.contains('Join Free').click();
    cy.url().should('include', '/register');
  });

  it('should show error for invalid login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('invalid@test.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
  });
});
