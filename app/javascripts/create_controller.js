app.controller('CreateCtrl', ['$scope', function ($scope) {

  function SHA256(msg) {
    return CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex);
  }

  function makeHash(creditRecord) {
    // TODO: make a better rule for generate hash
    var msg = "" + creditRecord.identity + (new Date()).toString()
    return '0x' + web3.sha3(msg, {encoding: "hex"});
  }

  $scope.categoryOptions = [
    {value: 0, name: 'Credit Loan'},
    {value: 1, name: 'Collateral Loan'},
    {value: 2, name: 'Guaranteed Loan'}
  ];
  $scope.stateOptions = [
    {value: 0, name: 'Applying'},
    {value: 1, name: 'Ongoing'},
    {value: 2, name: 'Complete'}
  ]

  $scope.creditRecord = creditRecord = {};

  $scope.createCreditRecord = function() {
    var commit = makeHash(creditRecord)

    console.log(commit);
    var data = {
      commit: commit,
      identity: creditRecord.identity,
      category: creditRecord.category,
      state: creditRecord.state,
      timestamp: Math.floor(new Date() / 1000),
      fee: creditRecord.fee,
      default: creditRecord.default,
      principal: creditRecord.principal,
      rate: creditRecord.rate,
      duration: creditRecord.duration,
      start_date: creditRecord.start_date,
      guarantor: creditRecord.guarantor,
      collateral: creditRecord.collateral,
      desc: creditRecord.desc
    }

    localStorage.setItem(commit, angular.toJson(data));

    // TODO: reset form after create

    credit_book.submit(
      encodeToBytes32(data.identity),
      data.category,
      data.state,
      data.fee,
      data.timestamp,
      data.commit,
      {from: currentUser}
    ).catch(function(e) {
      console.log(e)
    });

    // close upload modal
    $('#upload-modal').modal('hide');
  }

}]);
