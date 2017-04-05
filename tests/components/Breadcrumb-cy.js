describe('Breadcrumb', function () {
  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy'
    });
    cy.visitUrl({
      url: '/services/overview'
    });
  });

  context.only('some test', function () {
    it('unit test', function () {
      expect(true).to.be.equal(true);
    });
  });
});
