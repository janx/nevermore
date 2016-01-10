$(function() {
  var uploadBtn = $('.button.upload')
  var nextStepBtn = $('.btn.next-step')
  var detailData = $('.detail-data')

  // $('.search .form-control').focus()

  uploadBtn.on('click', function(e) {
    e.preventDefault()

    nextStepBtn.fadeIn()
    detailData.fadeOut()
  })

  nextStepBtn.on('click', function() {
    $(this).fadeOut()
    detailData.fadeIn(1000)
  })
})
