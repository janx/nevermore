app.controller('SearchCtrl', ['$scope', function ($scope) {

  $scope.creditRecords = function() {
    return window.credit_records;
  }

  $scope.buyable = function(cr) {
    if (cr.owner) {
      return false;
    }

    if (cr.orderstate === 0) {
      return true;
    } else {
      return false;
    }
  }

  $scope.reviewable = function(cr) {
    if (cr.owner) {
      return true;
    }

    if (cr.orderstate === 2) {
      return true;
    } else {
      return false;
    }
  }

  var source = $("#detail-data-template").html();
  var template = Handlebars.compile(source);
  $scope.showDetailData = function(commit) {
    console.log('showDetailData', commit);
    var data = localStorage.getItem(commit);
    var dataModal = $('#detail-data-modal')
    if (data) {
      data = angular.fromJson(data)
      dataModal.find('.card').html(template(data))
      dataModal.find('.identity').text("ID: " + data.identity)
      dataModal.modal('show');
    }
  }

  var cart = $scope.cart = [];

  $scope.changeCart = function($event, cr) {
    var checkbox = $event.target;
    var action = (checkbox.checked ? 'add' : 'remove');
    if (action == 'add') {
      cart.push(cr);
    } else {
      var index = cart.indexOf(cr);
      if (index > -1) {
        cart.splice(index, 1);
      }
    }
  }

  $scope.getTotal = function() {
    var total = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      total += $scope.cart[i].fee;
    }
    return total;
  }

  $scope.buy = function() {
    var list = [];
    for (var i=0; i < cart.length; i ++) {
      item = cart[i];
      list.push({commit: item.commit, fee: item.fee});
    }

    debugger
    $.publish('CreditRecord:buy', {list: list});

    $('#purchase-modal').modal('hide');

    for (var i=0; i < cart.length; i++) {
      cart[i].orderstate = 1;
    }

    $scope.cleanup();

    $('#result-modal').modal('show');
  }

  $scope.cleanup = function() {
    cart.splice(0, cart.length);
  }
}]);
