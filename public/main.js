

  // const koristi za varijable kojima se vrednost ne menja
  // let za varijable kojima se vrednost negde u kodu menja
 
  
  const socket = io();
  const canvas = document.getElementsByClassName('tabla')[0]
  const boja1 = document.getElementById('boja')
  const context = canvas.getContext('2d')
  const velicina = document.getElementById('izbc')
  const current = {color: 'red'}
  let drawing = false
  
  

  
  // Kada se promeni boja / velicina, saljemo novu boju / velicinu serveru
  boja1.onchange = () => socket.emit('colorChanged', boja1.value)
  velicina.onchange = () => socket.emit('sizeChanged', velicina.value)


  // Promeni boje / velicine
  socket.on('changeAllColors', (color) => boja1.value = color)
  socket.on('changeAllSizes', (size) => velicina.value = size)
  
  canvas.addEventListener('mousedown', onMouseDown, false)
  canvas.addEventListener('mouseup', onMouseUp, false)
  canvas.addEventListener('mouseout', onMouseUp, false)
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false)

  socket.on('drawing', onDrawingEvent)

  window.addEventListener('resize', onResize, false)
  onResize()

  function drawLine(x0, y0, x1, y1, boja, emit) {
    context.beginPath()
    context.moveTo(x0, y0)
    context.lineTo(x1, y1)
    context.strokeStyle = boja1.value
    context.lineWidth = velicina.value
    context.stroke()
    context.closePath()
    if (!emit) {
      return
    }

    const w = canvas.width
    const h = canvas.height
	
	
    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: boja
    })
  }


  
  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }

   
  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
	  
    drawLine(current.x, current.y, e.clientX, e.clientY, boja1.boja, true);
  }


  function onMouseMove(e){
    if (!drawing) { return; }
	
    drawLine(current.x, current.y, e.clientX, e.clientY, boja1.boja,true);
    current.x = e.clientX;
    current.y = e.clientY;
  }


  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time
        callback.apply(null, arguments)
      }
    }
  }

	function onDrawingEvent(data) {
    const w = canvas.width
    const h = canvas.height

    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.boja)
  }

    
	
  function onResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

	//funkcija za brisanje
	const brisi = function() {
		context.fillStyle = "white"
		context.fillRect(0, 0, canvas.width, canvas.height)
	}

	//brisanje table
	socket.on('clear_canvas', brisi)
   

	//brisanje cele table
  const brisanje = document.getElementById('clear')

  brisanje.addEventListener('click', function() {
    socket.emit('clear_canvas')
  })

  brisi()

	//brisanje samo table samo jednog klijenta
	document.getElementById('cisti').addEventListener('click', function () {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }, false)


  
 

	socket.emit('i')

