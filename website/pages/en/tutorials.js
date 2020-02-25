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

function Tutorial(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="tutorials-intro">
          <h1>
            Tutorials
          </h1>
          <p>
            OK, enough about the basics of the Gnosis Safe Contracts. Let’s start building a project with them!
          </p>
        </div>

        <div className="inner grid-blocks four-blocks-grid tutorials-boxes">
          <a href={docUrl("cpktutorial1")} className="white-box">
            <h3>
             Integrating the Gnosis Safe Proxy Kit
            </h3>
            <p>
             How to use the Gnosis Safe Contract Proxy Kit to perform batched transactions and interact with smart contracts.
            </p>
            <p className="box-icons">
              <i className="icon icon-small icon-time"></i>
              &nbsp;
              1h
              &nbsp;
              &nbsp;
              <i className="icon icon-small icon-star"></i>
              &nbsp;
              medium
              &nbsp;
              &nbsp;
              <i className="icon icon-small icon-pen"></i>
              JS
            </p>
          </a>
          <a className="white-box">
            <h3>
              To be continued...
            </h3>
            <p>
              More tutorials will be added over time. Make sure to come back and learn more about the Gnosis Safe contracts.
            </p>
          </a>
        </div>
      </Container>
    </div>
  );
}

module.exports = Tutorial;
