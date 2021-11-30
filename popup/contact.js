document.getElementById('contact-click').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});

document.querySelector('.close').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});


// Leave a Mp3 Audio Message / File Upload Contact Form
// -----------------------------------------------------
// Compatibility: IE 11+ (Edge), due to use of element dataset for i18n, 
//        WebAudio / MediaRecorder API, Promises / getUserMedia via mediaDevices.
//        On the fly lame mp3 conversion, fallback to script processor if audioWorklet unavailable.
//        Silent fallback to file upload or text input only if WebAudio API fails.
// Created: 2020.10.27, 14:20h, rakoon <dirkdigweed@gmx.net>

// function messageArea (selector, uploadurl, i18n, configuration) {
//   'use strict';
//   var settings = configuration ? configuration : {};
//   var W = window, N = W.navigator, D = W.document,
//      AC = W.AudioContext || W.webkitAudioContext, FR = W.FileReader, PE = W.PointerEvent,
//      T8 = { speak:'speak', type:'type', upload:'upload', back:'back', play:'play', pause:'pause', start:'start', stop:'stop',
//        label:'choose an input', recording:'recording...', playback:'Click to preview record.', cancel:'cancel', ok:'ok', 
//        record:'Click the microphone to record', drag:'Select or drag a file here', confirm:'confirm', ok:'ok',
//        select:'select file', audio:'%n has recorded a message.', file:'%n has attached a file.', saved:'saved',
//        error:'error', errorType:'file type not allowed.', errorSize:'%n is larger than %s.', delete:'delete',
//        noSupport:'Audio API not supported.', noPermission:'No access to microphone.', rename:'rename', add:'add', 
//        confirmDelete:'Delete this item permanently?', noFile:'No file recognized.'},
//    PTS = { pause:'M2 7h2V2H2v5zm3-5v5h2V2H5z', arrow:'M1 4l.8.7L4 2.4v6.1h1V2.4l2.2 2.3L8 4 4.5.5 1 4z', 
//        ok:'M3 8L.5 5.4l.7-.8L3 6.5 7.8 1l.7.8z', stop:'M2 2h5v5H2z', play:'M3 2v5l4-2.5z',
//        no:'M1 1.7l2.8 2.8L1 7.3l.7.7 2.8-2.8L7.3 8l.7-.7-2.8-2.8L8 1.7 7.3 1 4.5 3.8 1.7 1l-.7.7z',
//        rename:'M5,2H0.5v5H5V2z M7,2v5h1.5V2H7z M6.3,1h1V0.5H4.8V1h1v7h-1v0.5h2.5V8h-1V1z',
//        trash:'M6.5 8.5h-4l-.5-6h5l-.5 6zM4 8h2l.4-5H4v5zM7.5 2h-6V1H3V.5h3V1h1.5z', add:'M4 .5V4H.5v1H4v3.5h1V5h3.5V4H5V.5H4z',
//        key:'M8 .5H1L.5 1v7l.5.5h7l.5-.5V1L8 .5zm-.2 7.3H1.2V1.2h6.7v6.6zM3 2.5h1.3v4h-.8V7h2v-.5h-.7v-4H6V3h.5V2h-4v1H3v-.5z', 
//        mic:'M4.5 5.5C5.3 5.5 6 4.8 6 4V2C6 1.2 5.3.5 4.5.5S3 1.2 3 2v2c0 .8.7 1.5 1.5 1.5zM6.8 4c0 1.2-1 2.3-2.3 2.3S2.3 5.2 2.3 4h-.8c0 1.5 1.2 2.8 2.6 3v1.5h.8V7a3.1 3.1 0 002.6-3h-.7z', 
//        preview: 'M6 .5v2h2l-2-2zM3.1 5.1c0 .5.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zM5.5.5H1v8h7V3H5.5V.5zm.2 4.6l-.3.9 1 1.1-.5.4L5 6.4a3 3 0 01-.9.2c-.9 0-1.5-.7-1.5-1.5 0-.9.7-1.5 1.5-1.5s1.6.6 1.6 1.5z',
//        up:'M4.5 1.4c.6 0 1.3.2 1.7.7.5.5.7 1 .8 1.5a2 2 0 011.8 2 2 2 0 01-2 2H1.9C1 7.6.3 6.8.3 5.9c0-.9.7-1.7 1.6-1.7H2c0-.7.2-1.5.8-2 .4-.5 1.1-.8 1.7-.8zm0 1.7L3 4.5l.3.4 1-.9v2.6h.5V4l.9.8.3-.3-1.5-1.4z' },
//    APP = D.body || D.documentElement.body,
//    CLN = settings['class'] || 'message-area',
//    URL = W.URL || W.webkitURL, MAX = 2048000,
//    UPL = uploadurl ? uploadurl : (T8.uploadurl ? T8.uploadurl : null),
//    ACC = 'audio/*,video/*,image/*,.pdf,.txt,.rtf,.doc,.docx', REC = false,
//    ALL = D.querySelectorAll(selector);
//   // Check compatibility for FileReader/List API
//   if(!FR) return;
//   // Merge translation with i18n if present
//   if(i18n) merge(T8, i18n);
//   // Create message areas
//   [].forEach.call(ALL, function(a) { Area.call(a); });
//   // Main
//   function Area () {
//     var wrap = this, area = wrap.querySelector('textarea');
//     if(!area) return;
//     var t8 = (wrap.dataset) ? merge(T8, wrap.dataset) : T8, id = area.id || area.name,
//        nav = createEl('nav', {'dropzone':true, 'draggable':false,'tabindex':-1}),
//      label = wrap.querySelector('[for="'+ id +'"]'),
//       tBtn = createEl('button', {'type':'button','aria-label':t8.type}, null, svg(PTS.key), nav),
//       sBtn = AC ? createEl('button', {'type':'button','aria-label':t8.speak}, null, svg(PTS.mic), nav) : null,
//       uBtn = createEl('button', {'type':'button','aria-label':t8.upload}, null, svg(PTS.up), nav),
//       uUrl = t8.uploadurl ? t8.uploadurl : (UPL ? UPL : null),
//       back = createEl('button', {'type':'button','class':'back','aria-label':t8.close}, null, svg(PTS.arrow)),
//     output = createEl('fieldset', {'id':id+'-uploads','class':CLN+'-output'}, null),
//     browse = createEl('input', {'type':'file','id':id +'-files','accept':ACC}, null, null, nav),
//      files = [];
//     // Inject elements in order
//     wrap.className += ' '+ CLN;
//     wrap.appendChild(nav);
//     wrap.appendChild(back);
//     // Form, label, area & placeholder text
//     t8.originalLabel = label.textContent;
//     t8.originalPlaceholder = area.getAttribute('placeholder');
//     label.textContent = t8.label;
//     area.setAttribute('tabindex', -1);
//     area.setAttribute('readonly', true);
//     if(area.form) {
//       area.form.setAttribute('enctype', 'multipart/form-data');
//       area.form.onsubmit = function(){ area.removeAttribute('readonly'); }; 
//     }
//     // Show area navigation
//     setTimeout(function(){ nav.className = 'select'; }, 250);
//     // UI listeners
//     nav.onclick = present;
//     tBtn.onclick = select;
//     uBtn.onclick = select;
//     back.onclick = deselect;
//     browse.onchange = select;
//     if(AC) sBtn.onclick = select;
//     // Set drag & drop listeners
//     nav.ondragenter = dragEnter;
//     nav.ondragover = dragOver;
//     nav.ondrop = drop;
//     nav.ondragleave = dragLeave;
//     // Add global document drag listeners
//     addListeners(D, 'dragstart, dragover', dragStart);
//     addListeners(D, 'drop', preventAll);
//     // Private methods
//     function present (e) {
//       if (nav.className.match('selected')) return;
//       preventAll(e);
//       nav.className = 'select choose';
//       setTimeout(function(){ nav.className = 'select'; }, 500);
//     }
//     function select (e) {
//       nav.className = 'selected';
//       label.setAttribute('data-cache', t8.label);
//       if(this === tBtn) {
//         var areaC = area.getAttribute('data-cache');
//         if(areaC) { area.value = areaC; area.removeAttribute('data-cache'); }
//         nav.className += ' type';  
//         label.textContent = t8.originalLabel;
//         area.removeAttribute('readonly');
//         Msg(t8.originalPlaceholder);
//       }
//       else if(this === sBtn) {
//         getMedia( { audio:true }, 
//           function(stream){
//             var ps = '<path d="'+ PTS.play +'"/><path d="'+ PTS.pause +'"/>';
//             nav.className += ' speak'; 
//             label.textContent = t8.speak;
//             sBtn.className = 'ready'; 
//             sBtn.setAttribute('aria-label', t8.start);
//             sBtn.firstElementChild.innerHTML += ps;
//             Recorder(stream, { btn: sBtn, parent: nav, btnCnl: back });
//             Msg(t8.record);
//           },
//           function(err){ Dialog('alert', err.name ? err.message : t8.noPermission); }
//         );
//       }
//       else if(this === uBtn) { 
//         nav.className += ' upload';
//         label.textContent = t8.upload;
//         Msg(t8.drag); 
//         this.setAttribute('aria-label', t8.select);
//         this.onclick = function(){ browse.click(); };
//       }
//       else if(this === browse) { 
//         nav.className += ' upload';
//         handle(e);
//       }
//       area.focus();
//     }
//     function deselect (e) {
//       var lablC = label.getAttribute('data-cache');
//       if(lablC) { label.textContent = lablC; label.removeAttribute('data-cache'); }
//       if(area.value.length) { area.setAttribute('data-cache', area.value); area.value = ''; }
//       nav.className = 'select';
//       area.setAttribute('readonly', true);
//       back.className = 'back';
//       if(AC) {
//         var t = nav.querySelector('div');
//         if(t) t.parentNode.removeChild(t);
//         sBtn.firstChild.innerHTML = '<path d="'+ PTS.mic +'"/>';
//         sBtn.setAttribute('aria-label', t8.speak);
//         sBtn.removeAttribute('class');
//         sBtn.onclick = select;
//       }
//       uBtn.setAttribute('aria-label', t8.upload);
//       uBtn.onclick = select;
//       back.onclick = deselect;
//       nav.focus();
//     }
//     // Drag and drop
//     function dragStart (e) {
//       preventAll(e); 
//       var t = e.dataTransfer;
//       t.effectAllowed = 'none';
//       t.dropEffect = 'none';
//       select.call(uBtn);
//     }
//     function dragEnter (e) {
//       preventAll(e);
//       e.target.setAttribute('data-dragging','enter');
//     }
//     function dragOver (e) {
//       preventAll(e);
//       e.target.setAttribute('data-dragging','over');
//       e.dataTransfer.dropEffect = 'copy';
//     }
//     function dragLeave (e) {
//       e.target.removeAttribute('data-dragging');
//     }
//     function drop (e) {
//       handle(e);
//       dragLeave(e);
//     }
//     // File handling, upload & listing
//     function handle (e) {
//       var file;
//       if (e.type === 'change') file = e.target.files[0];
//       if (e.type === 'drop') file = e.dataTransfer.files[0];
//       if (!file) return Dialog('alert', t8.noFile);
//       var ex = file.name.substr(file.name.lastIndexOf('.') + 1),
//          acc = browse.accept || ACC, max = MAX || 4096,
//         mime = file.type.split('/')[0],
//         typM = acc.replace(/[,\*]/g,'').split('/').indexOf(mime) > -1,
//         extM = acc.replace(/\./g,'').split(',').indexOf(ex) > -1;
//       if((typM || extM) && file.size <= max) {
//         var r = new FR();
//         r.readAsDataURL(file);
//         r.onload = function(e) { Listing(file, r.result, 'upload', ex); };
//       }
//       else if(file.size > MAX) Dialog('alert', t8.errorSize.replace('%n', file.name).replace('%s', formatBytes(max,1))); 
//       else Dialog('alert', t8.errorType.replace('%n', ex.toUpperCase())); 
//     }
//     // Listing
//     function Listing (file, data, type, ext) {
//       var txt, a, prt, del, upl, prg, ren, nam, mime;
//       txt = truncate(file.name, 24) +' <i>'+ formatBytes(file.size) +'</i>';
//       prt = createEl('fieldset', {'class': CLN +'-listing '+ type});
//       prg = createEl('output', {'role':'progress','data-unit':'%'});
//       nam = createEl('i', {'role':'textbox','spellcheck':false,'contenteditable':true});
//       mime = file.type.split('/')[0];
//       wrap.insertAdjacentElement('afterend', prt);
//       if (ext.match(/(svg|png|jpg|jpeg|gif|bmp|webp)/ig)) {
//         var im = createEl('img', {'src': data}, null);
//         a = createEl('a', {'href':data,'title':file.name,'target':'_blank','rel':'noopener'}, txt, im, prt);
//       } 
//       else if (ext.match(/(mp3|wav|ogg|weba)/ig)) {
//         a = createEl('a', {'href':'#','title':file.name,'rel':'noopener'}, txt, svg(PTS.mic), prt);
//         var au = createEl('audio', {'src': data}, null, null, a),
//           path = audioToPath(data, 100, 32, 100), // width, height, lines
//         figure = createEl('figure',{} , null, svg(path,'0 0 100 32'), prt);
//         console.log(audioToPath(data, 100, 32, 100));
//         a.onclick = function () { au.play(); }
//       }
//       else {
//         a = createEl('a', {'href':data,'title':file.name,'rel':'download noopener'}, txt, svg(PTS.up), prt);
//         a.download = file.name;
//       }
//       a.className = mime +' '+ ext;
//       a.setAttribute('draggable', false);
//       ren = createEl('button', {'type':'button','class':'rename'}, t8.rename, svg([PTS.rename,PTS.no]), prt);
//       upl = createEl('button', {'type':'button','class':'upload'}, t8.upload, svg([PTS.arrow,PTS.ok]), prt);
//       del = createEl('button', {'type':'button','class':'delete'}, t8.delete, svg([PTS.trash,PTS.no]), prt);
//       upl.appendChild(prg); 
//       ren.appendChild(nam); 
//       files.push([file.name, file.size, data]);
//       a.ondblclick = rename;
//       ren.onclick = rename;
//       del.onclick = remove;
//       upl.onclick = upload;
//       // deselect();
//       a.focus();
//       function rename (e){
//         var ex = a.title.substr(a.title.lastIndexOf('.')), 
//           name = a.title.replace(ex,''); 
//         expand(ren);
//         prt.setAttribute('data-state','rename');
//         ren.setAttribute('disabled','');
//         nam.innerHTML = name;
//         nam.setAttribute('tabindex', 0);
//         W.getSelection().selectAllChildren(nam);
//         nam.onkeydown = function (e) { 
//           var key = e.key || e.keyCode || e.which;
//           if(key == 13 || key === 'Enter') upl.click(); 
//         };
//         upl.onclick = function (e) {
//           var nm = nam.innerHTML;
//           a.title = nm + ex; 
//           a.firstChild.textContent = truncate(nm, 20) + ex;
//           reset();
//         };
//         ren.onclick = function () { nam.focus(); };
//         del.onclick = reset;
//       }
//       function remove (e){ 
//         expand(del);
//         prt.setAttribute('data-state','delete');
//         ren.onclick = reset;
//         upl.onclick = function(){
//           reset();
//           prt.style.opacity = 0;
//           setTimeout(function(){ 
//             prt.parentElement.removeChild(prt); 
//             var n = D.querySelector('.'+ CLN +'-output a'); 
//             if(n) n.focus();
//           }, 250);
//         } 
//       }
//       function upload (e){ 
//         expand(upl);
//         prt.setAttribute('data-state','send');
//         prg.setAttribute('style', '--progress:0;');
//         del.onclick = reset;
//         upl.onclick = function(){
//           var unit = prg.getAttribute('data-unit') || '%';
//           prt.setAttribute('data-state', 'upload');
//           progress(1, unit);
//           var i = 5;
//           var int = setInterval(function(){ 
//             if(i <= 100){ progress(i, unit); i = i+5; } 
//             else { clearInterval(int); prt.setAttribute('data-state', 'sent'); upl.onclick = upload; }
//           }, 500);
//           del.onclick = function(){ clearInterval(int); }; 
//         }
//       }
//       function progress (n, unit){
//         W.requestAnimationFrame(progress);
//         prg.innerHTML = n + unit;
//         prg.style = '--progress:'+ n +';';
//       }
//       function expand (el) { 
//         D.addEventListener('click', block, true);
//         prt.addEventListener('keydown', trap, true);
//         a.setAttribute('tabindex',-1);
//         a.setAttribute('disabled','');
//         el.setAttribute('aria-expanded', true);
//         el.focus();
//       }
//       function reset () {
//         prt.removeAttribute('data-state');
//         [del, ren, upl].forEach(function(b) { 
//           b.setAttribute('aria-expanded', false);
//           b.removeAttribute('disabled');
//           b.removeAttribute('tabindex');
//         });
//         D.removeEventListener('click', block, true);
//         prt.removeEventListener('keydown', trap, true);
//         a.removeAttribute('tabindex');
//         a.removeAttribute('disabled');
//         del.onclick = remove; 
//         ren.onclick = rename; 
//         upl.onclick = upload;
//         a.focus();
//       }
//       function block (e) {
//         if(prt.contains(e.target)) return;
//         preventAll(e);
//         prt.className += ' static';
//         var btns = prt.querySelectorAll('button');
//         if(btns[0] !== e.target) btns[0].focus();
//         else btns[btns.length - 1].focus();
//         setTimeout(function(){ prt.classList.remove('static'); }, 500);
//       }
//     }
//     // Recorder
//     function Recorder (stream, config) {
//       var audio, context, node, input, output, analyser, encoder, worklet, ms;
//       var recording = false, playing = false;
//       // UI elements
//       var btn = config.btn instanceof Element ? config.btn : null, 
//        parent = config.parent instanceof Element ? config.parent : btn.parentElement,
//        btnCnl = config.btnCnl instanceof Element ? config.btnCnl : null, 
//       toolbar = createEl('div', {'role':'toolbar', 'class':'toolbar'}),
//        btnDel = createEl('button', {'type':'reset','aria-label':t8.delete}, null, svg(PTS.trash), toolbar),
//        btnAdd = createEl('button', {'type':'button','aria-label':t8.add}, null, svg(PTS.add), toolbar),
//        seeker = createEl('output', {'role':'slider','class':'seekbar'}, null, null, toolbar),
//        canvas = createEl('canvas', {'class':'visualizer', 'role':'illustration'});
//       // Set up audio stream, node, process, analyser, worker
//       W.localStream = stream;
//       context = new AC(); 
//       // Use audioWorkletNode if available, or try to create script / processor nodes
//       worklet = !W.AudioWorklet; // ! testing
//       if (worklet) { 
//         worklet = inputProcessorWorklet.toString();
//         if (worklet) {
//           worklet = worklet.slice(worklet.indexOf('{')+1, worklet.lastIndexOf('}'));
//           worklet = URL.createObjectURL(new Blob([worklet], {type:'application/javascript'}));
//           context.audioWorklet.addModule(worklet).then(function(){
//             node = new AudioWorkletNode(context, 'input-processor');
//             URL.revokeObjectURL(worklet);
//           });
//         }
//         else {
//           context.audioWorklet.addModule('input-processor-worklet.js').then(function(){
//             node = new AudioWorkletNode(context, 'input-processor');
//           });
//         }
//       }
//       else if (context.createJavaScriptNode) node = context.createJavaScriptNode(0, 1, 1);
//       else if (context.createScriptProcessor) node = context.createScriptProcessor(0, 1, 1);
//       else return Dialog('alert', t8.noSupport);
//       input = context.createMediaStreamSource(stream);
//       analyser = context.createAnalyser();
//       input.connect(analyser);
//       // Encoder
//       encoder = mp3EncoderWorker.toString(); 
//       if(encoder) {
//         encoder = URL.createObjectURL(new Blob(['(',encoder,')();'], {type:'application/javascript'}));
//         encoder = new Worker(encoder);
//         URL.revokeObjectURL(encoder);
//       } 
//       else encoder = new Worker('mp3-encoder-worker.js');
//       encoder.postMessage({ cmd: 'init', config: { sampleRate: context.sampleRate, bitRate: 16} });
//       encoder.onerror = function(err){ Dialog('alert', err.message); };
//       // Visualize audio stream
//       visualize(new Uint8Array(analyser.frequencyBinCount));
//       // Event listener
//       btn.onclick = toggle;
//       btnCnl.onclick = exit;
//       // Private methods
//       function toggle (e) { 
//         recording ? stop() : start(); 
//       }
//       function exit (e) { 
//         encoder.terminate();
//         context.close();
//         [].forEach.call(W.localStream.getTracks(), function(t){ t.stop(); });
//         if(parent.contains(toolbar)) parent.removeChild(toolbar);
//         if(parent.contains(canvas)) parent.removeChild(canvas);
//         btn.removeAttribute('data-time');
//         input = null;
//         output = null;
//         deselect(e);
//       }
//       function reset (e) { 
//         recording = false;
//         if(output) output.disconnect();
//         input.connect(analyser); 
//         if(parent.contains(toolbar)) parent.removeChild(toolbar);
//         btn.className = 'ready';
//         btn.removeAttribute('data-time');
//         btn.setAttribute('aria-label', t8.start);
//         btn.onclick = toggle;
//         btnCnl.onclick = exit;
//       }
//       function cancel (e) {
//         Dialog('confirm', t8.confirmDelete, reset);
//       }
//       function start () {
//         recording = true;
//         ms = Date.now(); 
//         input.connect(node);
//         node.connect(context.destination);
//         Msg(t8.recording);
//         btn.className = 'recording';
//         btn.setAttribute('aria-label', t8.stop);
//         btn.onclick = toggle;
//         btnCnl.onclick = cancel;
//         if (worklet) node.port.onmessage = process;
//         else node.onaudioprocess = process;
//       }
//       function process (e) {
//         if (!recording) return;
//         var buffer = worklet ? e.data.inputBuffer[0] : e.inputBuffer.getChannelData(0);
//         encoder.postMessage({ cmd: 'encode', buffer: buffer });
//         btn.setAttribute('data-time', formatMs((Date.now() - ms)/1000)); 
//       }
//       function pause () {
//         recording = false;
//         btn.className += ' paused';
//         if (worklet) node.port.onmessage = null;
//         else node.onaudioprocess = null;
//       }
//       function resume () {
//         recording = true;
//         btn.classList.remove('paused');
//         if (worklet) node.port.onmessage = process;
//         else node.onaudioprocess = process;
//       }
//       function stop (e) {  
//         recording = false;
//         node.disconnect();
//         input.disconnect();
//         audio = new Audio();
//         encoder.postMessage({ cmd: 'finish' });
//         encoder.onmessage = function (e) {
//           if (e.data.cmd === 'end') blobToDataURL(
//             new Blob(e.data.buffer, { type: 'audio/mp3' }),
//             function(res){ audio.src = res; }
//           );
//         };
//         seeker.innerHTML = '<i></i>';
//         parent.appendChild(toolbar);
//         parent.className += ' playback';
//         btn.className = 'play';
//         btn.setAttribute('aria-label', t8.play);
//         output = context.createMediaElementSource(audio);
//         output.connect(context.destination);
//         output.connect(analyser);
//         Msg(t8.playback);
//         btn.onclick = playback;
//         btnCnl.onclick = cancel;
//         btnDel.onclick = cancel;
//         btnAdd.onclick = function(e){ 
//           var file = {
//             type: 'audio/mp3', 
//             size: inBytes(audio.src),
//             name: 'Record-'+ new Date(ms).toISOString().split('.')[0] +'.mp3', 
//             duration: audio.duration
//           };
//           Listing(file, audio.src, 'record', 'mp3');
//           reset();
//         };
//       }
//       function playback (e) {
//         playing = !playing;
//         btn.setAttribute('aria-label', playing ? t8.pause : t8.play); 
//         btn.className = playing ? 'pause' : 'play'; 
//         playing ? audio.play() : audio.pause();
//         seeker.setAttribute('data-end', formatMs(audio.duration));
//         seeker.setAttribute('data-start', formatMs(audio.currentTime));
//         seeker.firstElementChild.onclick = seek;
//         audio.ontimeupdate = function (e) {
//           var time = formatMs(this.currentTime) +' / '+ formatMs(this.duration||0);
//           btn.setAttribute('data-time', time);
//           seeker.firstElementChild.innerHTML = time;
//           seeker.style = '--position:'+ (this.currentTime/this.duration) +';';
//           seeker.setAttribute('data-start', formatMs(this.currentTime));
//         };
//         audio.onended = function (e) { 
//           playing = false;
//           seeker.removeAttribute('style');
//           btn.setAttribute('aria-label', t8.play);
//           btn.className = 'play';
//         }
//         function seek (e) {
//           var re = this.getBoundingClientRect(), 
//            ratio = Math.abs((e.clientX - re.left)/re.width);
//           audio.currentTime = audio.duration * ratio;
//         }
//       }
//       function visualize (frequencies) {
//         var bars = 200, bar, barWidth, barHeight, barX, barY;
//         var dpr = W.devicePixelRatio || 1;
//         analyser.fftSize = 512; 
//         analyser.smoothingTimeConstant = 0.6;
//         parent.appendChild(canvas);
//         var rect = area.getBoundingClientRect();
//         canvas.width = rect.width * dpr;
//         canvas.height = rect.height * dpr;
//         // canvas.scale(dpr, dpr);
//         bar = canvas.getContext('2d');
//         bar.fillStyle = 'rgba(127,127,127,0.25)';
//         draw();
//         function draw () {
//           W.requestAnimationFrame(draw);
//           analyser.getByteFrequencyData(frequencies);
//           bar.clearRect(0, 0, canvas.width, canvas.height);
//           for (var i = 0; i < bars; i++) {
//             barWidth = canvas.width / bars;
//             barHeight = frequencies[i];
//             barX = i * (barWidth + 5);
//             barY = (canvas.height / 2) - (barHeight / 2);
//             bar.fillRect(barX, barY, barWidth, barHeight);
//           }
//           if(recording) {
//             var val = 0, len = frequencies.length;
//             for (var j = 0; j < len; j++) val += frequencies[j];
//             btn.style.setProperty('--peak', (val/len).toFixed(2));
//           }
//         }
//       }
//     }
//     // Audio Data to SVG path 
//     function audioToPath (url, width, height, num) {
//       var w = width || 100, h = height || 32, n = num || 100; 
//     }
//     // Dialogs, drawers & messages
//     function Msg (str) {
//       str = str ? str.charAt(0).toUpperCase() + str.slice(1) : null;
//       area.setAttribute('placeholder', str); 
//       // area.focus();
//     }
//     function Drawer (drawer, knob, persist) {
//       var a = knob || W.event.target || this;
//       if(!a.hasAttribute('aria-controls') && !D.querySelector(a.href) && !a.for) return;
//       var n = a.getAttribute('aria-controls') || a.href || a.for;
//       var el = drawer || D.getElementById(n.replace('#',''));
//       if(!el) return;
//       var btn = el.querySelector('.close, .back, .cancel');
//       if(!btn) btn = createEl('button', {'type':'button','class':'back'},t8.back,svg(PTS.close),el);
//       persist = persist || el.hasAttribute('data-persist') || el.className.match('persist');
//       var isOpen = el.hasAttribute('open');
//       a.setAttribute('aria-expanded', isOpen ? true : false);
//       a.onclick = isOpen ? close : open;
//       btn.onclick = close;
//       this.open = function open (e) {
//         el.setAttribute('open');
//         a.setAttribute('aria-expanded', true);
//         if(!persist) addListeners(D, 'click', block, true);
//         else addListeners(D, 'click', escape, false);
//         btn.onclick = close;
//         el.onkeydown = trap;
//         btn.focus();
//       }
//       this.close = function close (e) {
//         el.removeAttribute('open');
//         a.setAttribute('aria-expanded', false);
//         if(!persist) removeListeners(D, 'click', block, true);
//         else removeListeners(D, 'click', escape, false);
//       }
//       function escape (e) {
//         var k; e = e || W.event;
//         k = e.key || e.keyCode || e.which;
//         if(k === 'Escape' || k === 'Esc' || k === 27) close();
//         if(e.type === 'click' && !el.contains(e.target)) close();
//       }
//       function block (e) {
//         if(el.contains(e.target)) return;
//         preventAll(e);
//         el.className += ' static';
//         btn.focus();
//         setTimeout(function(){ el.classList.remove('static'); }, 500);
//       } 
//     }
//     function Dialog (type, str, callback, persist) {
//       var modal, dialog, message, content, field, buttons, ok, no;
//       message = str ? str.charAt(0).toUpperCase() + str.slice(1) : undefined;
//       buttons = '<button type="reset">'+ t8.cancel +'</button><button type="button">'+ t8.confirm +'</button>';
//       dialog = createEl('form', {'role':'document','aria-live':'polite'}, '<i>'+message+'</i>'+ buttons);
//       modal = createEl('div', {'class':CLN +'-dialog','role':'dialog','open':''}, null, dialog, wrap);
//       field = createEl('input', {'type':'text','placeholder':'Name','required':''});
//       ok = dialog.querySelector('button[type=button]');
//       no = dialog.querySelector('button[type=reset]');
//       if(type === 'prompt') no.injectAdjacentElement('beforeEnd', field);
//       else if(type === 'alert') dialog.removeChild(no);
//       if(type !== 'confirm') ok.innerHTML = t8.ok;
//       if(!persist) addListeners(D, 'click', block, true);
//       else addListeners(D, 'click', escape, false);
//       ok.onclick = callback instanceof Function ? action : close;
//       no.onclick = close;
//       modal.onkeydown = trap;
//       modal.className += ' fade';
//       ok.focus();
//       function close (e) {
//         modal.removeAttribute('open');
//         if(!persist) removeListeners(D, 'click', block, true);
//         else removeListeners(D, 'click', escape, false);
//         setTimeout(function(){ modal.parentElement.removeChild(modal); }, 250);
//       }
//       function action (e) {
//         close(); 
//         return callback.call(field.value); 
//       }
//       function escape (e) {
//         var k; e = e || W.event;
//         k = e.key || e.keyCode || e.which;
//         if(k === 'Escape' || k === 'Esc' || k === 27) close();
//         if(e.type === 'click' && !dialog.contains(e.target)) close();
//       }
//       function block (e) {
//         if(dialog.contains(e.target)) return;
//         preventAll(e);
//         modal.className += ' static';
//         ok.focus();
//         setTimeout(function(){ modal.classList.remove('static'); }, 500);
//       }
//     }
//   }
//   // Helper
//   function preventAll (e) {
//     e.stopPropagation(); e.preventDefault();
//   }
//   function merge (o1, o2) {
//     return [o1, o2].reduce(function(a, o) { for(var k in o) a[k] = o[k]; return a; }, {});
//   }
//   function truncate (str, n) {
//     var l = str.length, h = parseInt(n/2,10);
//     return (l > n) ? str.substr(0, h-1) +'…'+ str.slice(l-h) : str;
//   }
//   function createEl (name, atts, text = null, elem = null, parent = null) {
//     var el = D.createElement(name);
//     for(var k in atts) el.setAttribute(k, atts[k]);
//     if(text) el.innerHTML = text; 
//     if(elem instanceof Element) el.appendChild(elem);
//     if(parent) parent.appendChild(el);
//     return el;
//   }
//   function svg (path, box, cln, label) { 
//     var el = D.createElementNS('http://www.w3.org/2000/svg','svg'); 
//     el.setAttribute('viewBox', box ? box : '0 0 9 9');
//     if(cln) el.className = cln;
//     if(path instanceof Array) path.forEach(function(p){ el.innerHTML += '<path d="'+ p +'"/>'; });
//     else if (path) el.innerHTML = '<path d="'+ path +'"/>';
//     if(!label) el.setAttribute('aria-hidden', true); 
//     else el.setAttribute('aria-label', label);
//     return el;
//   }
//   function removeListeners (el, types, call, active = false) {
//     types.split(',').forEach(function(t){ el.removeEventListener(t.trim(), call, active); });
//   }
//   function addListeners (el, types, call, active = false) {
//     removeListeners(el, types, call, active);
//     types.split(',').forEach(function(t){ el.addEventListener(t.trim(), call, active); });
//   }  
//   function dataURLtoBlob(url) {
//       var a = url.split(','), mime = a[0].match(/:(.*?);/)[1],
//         str = atob(a[1]), n = str.length, u8a = new Uint8Array(n);
//       while(n--) u8a[n] = str.charCodeAt(n);
//       return new Blob([u8a], {type:mime});
//   }    
//   function blobToDataURL (blob, res) {
//     var r = new FR();
//     r.onload = function (){ return res instanceof Function ? res(r.result) : r.result; };
//     r.readAsDataURL(blob);
//   }
//   function formatMs (n) {
//     var h = Math.floor(n/3600), 
//         m = Math.floor((n-(h*3600))/60), 
//         s = Math.floor(n-(h*3600)-(m*60));
//     if (m < 10) m = '0'+ m; 
//     if (s < 10) s = '0'+ s;
//     return m +':'+ s;
//   }
//   function formatBytes (bytes, dec) {
//     var s = ['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'],
//       dec = dec ? dec : 2;
//     for(var i = 0, r = bytes, b = 1024; r > b; i++) r /= b;
//     return parseFloat(r.toFixed(dec)) +' '+ s[i];
//   }
//   function inBytes (str) { // byte size of utf-8 string
//     if(typeof str !== 'string') return 0;
//     var b = str.length;
//     for (var i=str.length-1; i>=0; i--) {
//       var c = str.charCodeAt(i);
//       if (c > 0x7f && c <= 0x7ff) b++;
//       else if (c > 0x7ff && c <= 0xffff) b += 2;
//       if (c >= 0xDC00 && c <= 0xDFFF) i--;
//     }
//     return b;
//   }
//   function trap (e) { // Trap focus in element
//     var els = this.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([hidden]):not([type=hidden]), select:not([disabled]):not([hidden])');
//     if (!els || e.key !== 'Tab' || e.keyCode !== 9) return;
//     var f = els[0], l = els[els.length-1], a = D.activeElement;
//     if (e.shiftKey && a === f) { e.preventDefault(); l.focus(); }
//     else if (a === l) { e.preventDefault(); f.focus(); }
//   }
//   function getMedia (constraints, res, err) { // Shim old getUserMedia API
//     if (N.mediaDevices === undefined) N.mediaDevices = {};
//     if (N.mediaDevices.getUserMedia === undefined) {
//       N.mediaDevices.getUserMedia = function(constraints) {
//         var gum = N.getUserMedia || N.webkitGetUserMedia || N.mozGetUserMedia || N.msGetUserMedia;
//         if (!gum) return;
//         return new Promise(function(res, err) { gum.call(N, constraints, res, err); });
//       }
//     }
//     else return N.mediaDevices.getUserMedia(constraints).then(res).catch(err);
//   }
// }

// // Inline audio worklet
// // input-processor-worklet.js
// function inputProcessorWorklet () {
//   registerProcessor('input-processor', class extends AudioWorkletProcessor {
//     constructor () { super(); }
//     process (inputs, outputs, parameters) {
//       var output = outputs[0], buffers = [];
//       output.forEach(function(channel) {
//         for (var i = 0; i < channel.length; i++) {
//           buffers.push(channel[i]);
//         }
//       });
//       this.port.postMessage({inputBuffer: buffers});
//       return true;
//     }
//   });
// }

// // Inline worker
// // mp3-encoder-worker.js
// function mp3EncoderWorker () {
//   importScripts('https://cdn.jsdelivr.net/gh/zhuker/lamejs/lame.min.js');
//   var mp3Encoder, maxSamples = 1152, samplesMono, config, dataBuffer;
//   self.onmessage = function (e) {
//     switch (e.data.cmd) {
//       case 'init': init(e.data.config); break;
//       case 'encode': encode(e.data.buffer); break;
//       case 'finish': finish(); break;
//     }
//   };
//   function init (configuration) {
//     config = configuration || {debug: true};
//     mp3Encoder = new lamejs.Mp3Encoder(1, config.sampleRate || 44100, config.bitRate || 128);
//     clearBuffer();
//   }
//   function encode (arrayBuffer) {
//     samplesMono = convertBuffer(arrayBuffer);
//     var remaining = samplesMono.length;
//     for (var i = 0; remaining >= 0; i += maxSamples) {
//       var left = samplesMono.subarray(i, i + maxSamples);
//       var buff = mp3Encoder.encodeBuffer(left);
//       appendToBuffer(buff);
//       remaining -= maxSamples;
//     }
//   }
//   function finish () {
//     appendToBuffer(mp3Encoder.flush());
//     self.postMessage({ cmd: 'end', buffer: dataBuffer });
//     clearBuffer(); //free up memory
//   }
//   function clearBuffer () {
//     dataBuffer = [];
//   }
//   function appendToBuffer (mp3Buffer) {
//     dataBuffer.push(new Int8Array(mp3Buffer));
//   }
//   function convertBuffer (arrayBuffer){
//     var data = new Float32Array(arrayBuffer);
//     var out = new Int16Array(arrayBuffer.length);
//     floatTo16BitPCM(data, out)
//     return out;
//   }
//   function floatTo16BitPCM (input, output) {
//     for (var i = 0; i < input.length; i++) {
//       var s = Math.max(-1, Math.min(1, input[i]));
//       output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
//     }
//   }
// }