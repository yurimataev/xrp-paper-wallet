generate();

function generate() {
  var walletCount = parseInt(document.getElementById('wallet_count').value);
  var c = document.getElementById('currency');
  var currency = c.options[c.selectedIndex].value;

  var pageTitle = currency + ' Paper Wallet';
  document.getElementById('heading').innerHTML = document.title = pageTitle;

  switch (currency) {
    case 'XRP':
      genXrp(walletCount || 9);
      break;
    case 'ETH':
      genEth(walletCount || 9);
      break;
    case 'XMR':
      genXmr(walletCount || 8);
      break;
  }
}

function genXrp (walletCount) {
  genWallets (walletCount, function () {
    var api = new ripple.RippleAPI();
    var account = api.generateAddress();
    return {
      'address' : account.address,
      'secret' : account.secret
    }
  });
}

function genEth (walletCount) {
  genWallets (walletCount, function () {
    var api = new Web3EthAccounts();
    var account = api.create();
    return {
      'address' : account.address,
      'secret' : account.privateKey
    }
  });
}

function genXmr (walletCount) {
  var seed = cnUtil.sc_reduce32(cnUtil.rand_32());
  genWallets (walletCount, function () {
    var keys = cnUtil.create_address(seed);

    return {
      'address' : cnUtil.pubkeys_to_string(keys.spend.pub, keys.view.pub),
      // 'secret' : keys.spend.sec,
      'secret' : keys.view.sec,
      'mnemonic' : mn_encode(seed)
    }
  });
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
  if (account['mnemonic']) {
    document.getElementById('mnemonic').style.display = 'block';
    document.querySelector('#mnemonic h2').innerHTML = account['mnemonic'];
  } else {
    document.getElementById('mnemonic').style.display = 'none';
  }
}