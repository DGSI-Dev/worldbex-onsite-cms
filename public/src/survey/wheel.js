

//EXPECTED PRIZE
let randomizeArray = array => array[Math.floor(Math.random() * array.length)];
let randomvalue = randomizeArray(prizeSelections)

// FIND INDEX OF EXPECTED PRIZE
let myPrize = prizes.findIndex((element, index) => element.id === randomvalue.id)

let formatWheelData = (arr = []) => {
  return arr.map(({ fillStyle, name, textFillStyle }) => ({ fillStyle, text: name, textFillStyle }))
}

toDisplayOnWheel.push(...formatWheelData(prizes))
toDisplayOnWheel.push(...formatWheelData(prizes))
  
let theWheel = new Winwheel({
    'canvasId'    : 'canvas',
    'responsive'   : true,  // This wheel is responsive!
    'outerRadius'     : 300,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 75,         // Make wheel hollow so segments don't go all way to center.
    // 'textFontSize'    : 15,         // Set default font size for the segments.
    'numSegments'     : toDisplayOnWheel.length,         // Specify number of segments.
    'textAlignment'   : 'inner',    // Align text to outside of wheel.
    'segments' : toDisplayOnWheel,
    'pins' :
    {
      'outerRadius': 6,
      'responsive' : true, // This must be set to true if pin size is to be responsive, if not just location is.
    },
    'animation' :           // Specify the animation to use.
    {
      'type': 'spinToStop',
      // 'stopAngle'    : 0,
      // 'duration' : 1,    // Duration in seconds.
      'spins'    : 5,     // Default number of complete spins.
      'callbackFinished' : getPrize,
      'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
      'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
    },
});

// -----------------------------------------------------------------
// Called by the onClick of the canvas, starts the spinning.
function startSpin()
{
  // Stop any current animation.
  theWheel.stopAnimation(false);

  // Reset the rotation angle to less than or equal to 360 so spinning again
  // works as expected. Setting to modulus (%) 360 keeps the current position.

  // // //Default
  // theWheel.rotationAngle = theWheel.rotationAngle % 360;

  // // Set Prize
  // var stopAt = theWheel.getRandomForSegment(prizes.length);
  // var stopAt = theWheel.getRandomForSegment(0);
  var stopAt = theWheel.getRandomForSegment( parseInt(myPrize) + 1);

  theWheel.animation.stopAngle = stopAt;

  // Start animation.
  theWheel.startAnimation();
}
 let audio = new Audio('plugins/javascript-winwheel-2.8.0/tick.mp3');

// This function is called when the sound is to be played.
function playSound()
{
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
}

 // -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function getPrize(indicatedSegment)
{
  myWheel.hide()
  if (indicatedSegment.text.toUpperCase() == 'THANK YOU!') {
    new bootstrap.Modal(document.getElementById('losePrize')).show()
        
    let endAudio = new Audio('plugins/javascript-winwheel-2.8.0/fail.mp3');
    endAudio.play();
    let prizeInfo = prizes.find(({ name }) => name == indicatedSegment.text)
    submitPrize(currentEventId, currentUserId, prizeInfo.id, indicatedSegment.text)
  } else {
    let prizeInfo = prizes.find(({ name }) => name == indicatedSegment.text)
    submitPrize(currentEventId, currentUserId, prizeInfo.id, indicatedSegment.text)
    new bootstrap.Modal(document.getElementById('wonPrize')).show()
    $(".itemName").text(indicatedSegment.text)
    
    let endAudio = new Audio('plugins/javascript-winwheel-2.8.0/success.mp3');
    endAudio.play();
  }
}