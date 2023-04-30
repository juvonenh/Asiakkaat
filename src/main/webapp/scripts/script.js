// Funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
	    Array.from(new FormData(form).entries())
	        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	        );	
} 

// Funktio tietojen hakemista varten. Kutsutaan backin GET metodia
function haeAsiakkaat() {
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value;
	let requestOptions = {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded" }       
	};    
	fetch(url, requestOptions)
	.then(response => response.json()) // Muutetaan vastausteksti JSON-objektiksi 
	.then(response => printItems(response))
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

// Kirjoitetaan tiedot taulukkoon JSON-objektilistasta	
function printItems(respObjList){
	//console.log(respObjList);
	let htmlStr="";
	for(let item of respObjList){ // Yksi kokoelmaloopeista		
    	htmlStr+="<tr id='rivi_"+item.asiakas_id+"'>";
    	htmlStr+="<td>"+item.etunimi+"</td>";
    	htmlStr+="<td>"+item.sukunimi+"</td>";
    	htmlStr+="<td>"+item.puhelin+"</td>";
    	htmlStr+="<td>"+item.sposti+"</td>";
    	// encodeURI() muutetaan erikoismerkit, välilyönnit jne. UTF-8 merkeiksi	
    	htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi)+"','"+encodeURI(item.sukunimi)+"')>Poista</span></td>";
    	htmlStr+="</tr>";    	
	}	
	document.getElementById("tbody").innerHTML = htmlStr;	
}

// Tutkitaan lisättävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaLisaa(){
	if(tutkiTiedot()){
		lisaaTiedot();
	}
}

// Funktio syöttötietojen tarkistamista varten (yksinkertainen)
function tutkiTiedot(){
	let ilmo="";	
	if(document.getElementById("etunimi").value.length<1){
		ilmo="Etunimi ei kelpaa!";	
		document.getElementById("etunimi").focus();	
	}else if(document.getElementById("sukunimi").value.length<1){
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();
	}else if(!validoiPuhelin(document.getElementById("puhelin").value)) {
		ilmo="Puhelinnumero ei kelpaa!";	
		document.getElementById("puhelin").focus();
	}else if(!validoiSposti(document.getElementById("sposti").value)) {
		ilmo="Sähköposti ei kelpaa!";
		document.getElementById("sposti").focus();	
	}
	if(ilmo!=""){
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
		return false;
	}else{
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value);
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value);
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value);
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value);	
		return true;
	}
}

// Funktio puhelinnumeron validoimiseksi
function validoiPuhelin(input_str) {
  let re = /^\(?(\d{2,3})\)?[- ]?(\d{4,10})$/;

  return re.test(input_str);
}

// Funktio sähköpostin validoimiseksi, ei suositeltavaa tehdä regexillä tosielämässä!!
function validoiSposti(input_str) {
  let re = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

  return re.test(input_str);
}

// Funktio XSS-hyökkäysten estämiseksi (Cross-site scripting)
function siivoa(teksti){
	teksti=teksti.replace(/</g, "");//&lt;
	teksti=teksti.replace(/>/g, "");//&gt;	
	teksti=teksti.replace(/'/g, "''");//&apos; // Auttaa suojaamaan SQL-injektioilta
	return teksti;
}

// Funktio tietojen lisäämistä varten. Kutsutaan backin POST-metodia ja välitetään kutsun mukana auton tiedot JSON-stringinä.
function lisaaTiedot(){
	let formData = serialize_form(document.lomake); // Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);
	let url = "asiakkaat";    
    let requestOptions = {
        method: "POST", // Lisätään asiakas
        headers: { "Content-Type": "application/json" },  
    	body: formData
    };    
    fetch(url, requestOptions)
    .then(response => response.json())// Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
   			document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys epäonnistui.";	
        }else if(responseObj.response==1){ 
        	document.getElementById("ilmo").innerHTML = "Asiakkaan lisäys onnistui.";
			document.lomake.reset(); // Tyhjennetään asiakkaan lisäämisen lomake		        	
		}
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

function varmistaPoisto(asiakas_id, etunimi, sukunimi){
	// decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
	if(confirm("Poista asiakas " + decodeURI(etunimi) + " " + decodeURI(sukunimi) +"?")){
		poistaAsiakas(asiakas_id, decodeURI(etunimi), decodeURI(sukunimi));
	}
}

// Poistetaan asiakas kutsumalla backin DELETE-metodia ja välittämällä sille poistettavan asiakkaan id
function poistaAsiakas(asiakas_id, etunimi, sukunimi){
	let url = "asiakkaat?asiakas_id=" + asiakas_id;    
    let requestOptions = {
        method: "DELETE"             
    };    
    fetch(url, requestOptions)
    .then(response => response.json()) // Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
			alert("Asiakkaan poisto epäonnistui.");	        	
        }else if(responseObj.response==1){ 
			document.getElementById("rivi_"+asiakas_id).style.backgroundColor="red";
			// decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
			alert("Asiakkaan " + decodeURI(etunimi) + " " + decodeURI(sukunimi) +" poisto onnistui."); 
			haeAsiakkaat();        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}