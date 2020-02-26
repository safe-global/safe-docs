/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: 'How CT can be used to make Trades under certain Conditions',
      title: 'Tokens, Gaming, and Forking Gardens',
    },
    {
      content: 'Make decission based on prediction markets',
      title: 'Futarchy',
    },
    {
      content: "How can Conditional Tokens be used for Games",
      title: 'Games',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="tutorials-intro">
          <h1>
               Utilizing the Safe contracts
          </h1>
          <p>
            Learn about the different projects using the safe contracts. 
          </p>
        </div>


        <div className="inner index-section-boxes grid-blocks three-blocks-grid">
          <a href="https://medium.com/universal-ethereum/universal-login-beta-3-gnosis-safe-support-more-9b72be0e01f8" className="white-box">
            <h3>
              Universal Login
            </h3>
            <p>
              Universal Login Beta 3: Gnosis Safe Support & More
            </p>
          </a>
          <a href="https://blog.gnosis.pm/network-effects-gnosis-safe-and-pepo-the-new-dapp-for-the-crypto-community-3b8160e62898" className="white-box">
            <h3>
              PEPO
            </h3>
            <p>
              Network Effects: Gnosis Safe and Pepo, the new dapp for the crypto community
            </p>
          </a>
          <a href= "https://safe.gnosis.io/" className="white-box">
            <h3>
              Gnosis Safe
            </h3>
            <p>
              The most secure way to manage your crypto funds
            </p>
          </a>
        
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
