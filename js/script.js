newripple(10);

function newripple(count) {
	var api = new ripple.RippleAPI();
	
	for (var i=1; i<=count; i++) {
		var wallet = 'wallet'+i;
		if (document.getElementById(wallet) === null) {
			var clone = document.getElementById('wallet1').cloneNode(true);
			clone.setAttribute( 'id', wallet);
			document.querySelector('#container').appendChild( clone );
		}
		wallet = '#' + wallet;
		var account = api.generateAddress();
		document.querySelector(wallet + " .qr-address").innerHTML = '';
		var qrcodeAddress = new QRCode(document.querySelector(wallet + " .qr-address"),{width: 90,height: 90});
		document.querySelector(wallet + " .qr-secret").innerHTML = '';
		var qrcodeSecret = new QRCode(document.querySelector(wallet + " .qr-secret"),{width: 90, height: 90});

		document.querySelector(wallet + " .address").innerHTML = account.address;
		document.querySelector(wallet + " .secret").innerHTML = account.secret;
		qrcodeAddress.makeCode(account.address);
		qrcodeSecret.makeCode(account.secret);
	}
}
