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
        <div className="index-info-block grid-blocks two-blocks-grid">
          <div className="index-info-block-title">
            Conditional Token Use Cases
          </div>
          <div className="index-info-block-text">
            <p>
            Learn about the different Use Cases of Conditional Tokens.
            </p>
          </div>
        </div>

        <div className="inner index-section-boxes grid-blocks three-blocks-grid">
          <a href={docUrl("game1")} className="white-box">
            <h3>
              Tokens, Gaming, and Forking Gardens
            </h3>
            <p>
              How prediction market tools like conditional tokens can change gaming
            </p>
          </a>
          <a href={docUrl("X")} className="white-box">
            <h3>
              Futarchy
            </h3>
            <p>
              Make decission based on prediction markets 
            </p>
          </a>
          <a href={docUrl("doc5")} className="white-box">
            <h3>
              Games
            </h3>
            <p>
              How can Conditional Tokens be used for Games
            </p>
          </a>
        
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
