describe('Service Detail Page', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      nodeHealth: true
    });
  });

  context('Navigate to service page', function () {

    it('should show the \'Page Not Found\' alert panel', function () {
      cy.visitUrl({url: '/services/non-existing-service'});
      cy.get('.page-body-content').contains('Page not found');
    });

  });

  context('Navigate to service detail page', function () {

    it('shows the \'Service Not Found\' alert panel in page contents', function () {
      cy.visitUrl({url: '/services/overview/non-existing-service'});
      cy.get('.page-body-content').contains('Service not found');
    });

    it('shows instances tab per default', function () {
      cy.visitUrl({url: '/services/overview/%2Fsleep'});

      cy.get('.menu-tabbed-item .active').contains('Instances')
        .get('.table').contains('sleep');

      cy.hash().should('match', /services\/overview\/%2Fsleep\/tasks.*/);
    });

    it('shows configuration tab when clicked', function () {
      cy.visitUrl({url: '/services/overview/%2Fsleep'});

      cy.get('.menu-tabbed-item').contains('Configuration').click();

      cy.get('.menu-tabbed-item .active').contains('Configuration')
        .get('.configuration-map');

      cy.hash().should('match', /services\/overview\/%2Fsleep\/configuration.*/);
    });

    it('shows debug tab when clicked', function () {
      cy.visitUrl({url: '/services/overview/%2Fsleep'});

      cy.get('.menu-tabbed-item').contains('Debug').click();

      cy.get('.menu-tabbed-item .active').contains('Debug')
        .get('.page-body-content').contains('Last Changes');

      cy.hash().should('match', /services\/overview\/%2Fsleep\/debug.*/);
    });

    it('shows volumes tab when clicked', function () {
      cy.visitUrl({url: '/services/overview/%2Fsleep'});

      cy.get('.menu-tabbed-item').contains('Volumes').click();

      cy.get('.menu-tabbed-item .active').contains('Volumes');

      cy.get('.table')
        .contains('tr', 'volume-1')
        .parents('.table')
        .contains('tr', 'volume-2');

      cy.hash().should('match', /services\/overview\/%2Fsleep\/volumes.*/);
    });

  });

});
