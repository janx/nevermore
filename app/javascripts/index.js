
$(document).ready(function() {
  var uploadBtn = $('.btn.upload')
  var purchaseConfirm = $('#purchase-confirm')

  uploadBtn.on('click', function(e) {
    e.preventDefault()
  })

  purchaseConfirm.on('click', function() {
    $('#purchase-modal').modal('hide')
    $('#result-modal').modal('show')
  })
})
