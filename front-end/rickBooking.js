
  
    function showPrices() {
      const pickup = document.getElementById('pickup').value;
      const dropoff = document.getElementById('dropoff').value;

      if (!pickup || !dropoff) {
        alert("Please select both pick-up and drop-off locations!");
        return;
      }

      if (pickup === dropoff) {
        alert("Pick-up and Drop-off locations cannot be the same!");
        return;
      }

      document.getElementById('priceResults').classList.remove('hidden');
    }
    function confirmbtn(){
        alert('You have Selected Rickshaw!');
    }
