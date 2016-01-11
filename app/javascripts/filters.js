var filters = angular.module('neverMoreFilters', [])
filters.filter('categoryFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Credit Loan";
        break;
      case 1:
        result = "Collateral Loan"
        break;
      case 2:
        result = "Guaranteed Loan"
        break;
    }

    return result;
  };
});


filters.filter('stateFilter', function() {
  return function(input) {
    var result = "";
    switch(input) {
      case 0:
        result = "Applying";
        break;
      case 1:
        result = "Ongoing";
        break;
      case 2:
        result = "Complete";
        break;
    }

    return result;
  }
});

filters.filter('providerName', function() {
  return function(input) {
    var provider = Providers[input];
    if(provider) {
      return provider.name;
    } else {
      return 'Unknown';
    }
  };
});
