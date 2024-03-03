describe('App front page renders', function () {
  it('front page shows specific texts', function () {
    cy.visit('/');
    cy.contains('Workout Plan App');
  });
});