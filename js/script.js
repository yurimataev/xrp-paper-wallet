generate();

function generate() {
  var walletCount = parseInt(document.getElementById('wallet_count').value);
  var c = document.getElementById('currency');
  var currency = c.options[c.selectedIndex].value;

  var pageTitle = currency + ' Paper Wallet';
  document.getElementById('heading').innerHTML = document.title = pageTitle;

  if (walletCount <= 0) {
    alert ('Enter an integer greater than 0 for wallet count.');
    return;
  }

  switch (currency) {
    case 'XRP':
      genWallets (walletCount, function () {
        var api = new ripple.RippleAPI();
        var account = api.generateAddress();
        return {
          'address' : account.address,
          'secret' : account.secret
        }
      });
      break;
    case 'ETH':
      genWallets (walletCount, function () {
        var api = new Web3EthAccounts();
        var account = api.create();
        return {
          'address' : account.address,
          'secret' : account.privateKey
        }
      });
      break;
  }
}

function genWallets(count, addressGenerator) {
	// destroy all but the first wallet
  var nl = document.querySelectorAll('div.wallet');
  nl.forEach(
    function(currentValue, currentIndex, listObj) {
      if (currentIndex > 0) {
        currentValue.remove();
      }
    }
  );

	for (var i=1; i<=count; i++) {
		var wallet = 'wallet'+i;
		if (document.getElementById(wallet) === null) {
			var clone = document.getElementById('wallet1').cloneNode(true);
			clone.setAttribute( 'id', wallet);
			document.querySelector('#container').appendChild( clone );
		}
		wallet = '#' + wallet;
		var account = addressGenerator();
		document.querySelector(wallet + ' .qr-address').innerHTML = '';
		var qrcodeAddress = new QRCode(document.querySelector(wallet + ' .qr-address'),{width: 90,height: 90});
		document.querySelector(wallet + ' .qr-secret').innerHTML = '';
		var qrcodeSecret = new QRCode(document.querySelector(wallet + ' .qr-secret'),{width: 90, height: 90});

		document.querySelector(wallet + ' .address').innerHTML = account['address'];
		document.querySelector(wallet + ' .secret').innerHTML = account['secret'];
		qrcodeAddress.makeCode(account['address']);
		qrcodeSecret.makeCode(account['secret']);
	}
}