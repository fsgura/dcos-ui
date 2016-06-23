describe('Job Actions', function () {

  context('Edit Action', function () {
    beforeEach(function () {
      cy.configureCluster({
        jobDetails: true,
        mesos: '1-for-each-health',
        nodeHealth: true
      });
      cy.visitUrl({url: '/jobs/foo'});
      cy.get('.button-collection .button').contains('Edit').click();
    });

    it('opens the correct jobs edit modal', function () {
      cy.get('.modal .form-panel input[name="id"]')
        .should('to.have.value', 'foo');
    });

    it('closes modal on successful API request', function () {
      cy
        .route({
          method: 'PUT',
          url: /chronos\/v0\/scheduled-jobs\/foo/,
          response: [],
          delay: 500
        });
      cy.get('.modal .button-collection .button-success')
        .contains('Change and deploy')
        .click();
      cy.get('.modal').should('to.have.length', 0);
    });

    it('closes modal on secondary button click', function () {
      cy.get('.modal .button-collection .button').contains('Cancel')
        .click();
      cy.get('.modal').should('to.have.length', 0);
    });
  });

});