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

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => `${baseUrl}${page}`

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner index-info-block grid-blocks two-blocks-grid">
          <div
          className="index-info-block-title">
            Build on the Gnosis Safe smart contracts: take advantage of the most modular, flexible, and secure wallet and identity solution in Ethereum.
          </div>
          <div className="index-info-block-text">
            <p>
            The Safe developer portal aims to provide an overview of the Gnosis Safe smart contracts, interfaces and integrations. </p>
            <p>It’s a place where you can explore different use cases, as well as detailed tutorials on how to make use of our stack, add more security to managing funds on Ethereum and interact with the decentralized web.
            </p>
          </div>
        </div>

        <div className="inner index-section-boxes grid-blocks four-blocks-grid">
          <a href={docUrl("intro_assets")} className="white-box">
            <h3>
              Introduction
            </h3>
            <p>
              An overview of the Gnosis Safe <strong>advantages</strong>.
            </p>
          </a>
          <a href={docUrl("contracts_intro")} className="white-box">
            <h3>
              Smart contract
            </h3>
            <p>
              <strong>Deep dive</strong> into the Gnosis Safe contracts
            </p>
          </a>
          <a href={docUrl("services_relay")} className="white-box">
            <h3>
              Services
            </h3>
            <p>
              Explore the <strong>convenient</strong> services provided by Gnosis for the Gnosis Safe
            </p>
          </a>
          <a href={docUrl("sdks_overview")} className="white-box">
            <h3>
              SDKs
            </h3>
            <p>
              <strong>Integrate</strong> the Gnosis Safe smart contracts into your own project.
            </p>
          </a>
        </div>

        <div className="inner index-section-last-boxes grid-blocks two-blocks-grid">
          <a href={pageUrl("#support")} className="white-box">
            <h3>
              Support
            </h3>
            <p>
              Need some <strong>help</strong>? Looking for <strong>tutorials</strong>? Reach out to us!
            </p>
          </a>

          <a href={pageUrl("#projects")} className="white-box">
            <h3>
              Projects
            </h3>
            <p>
              <strong>Explore</strong> existing Gnosis Safe Contracts applications
            </p>
          </a>
        </div>

        <div className="inner index-what-are grid-blocks two-blocks-grid">
          <div>
            <h2>
              What is the Gnosis Safe?
            </h2>
          </div>
          <div>
          The Gnosis Safe is the most secure way to manage your crypto funds. Our goal is to deliver the highest level of security combined with great user experience for anyone holding Ether, ERC20 tokens and other digital assets and Ethereum. Transparency and security are our core principles. This is why our smart contracts and services are open source. As a contract wallet, the Gnosis Safe has a wide range of functionalities that are often not possible with traditional crypto and blockchain wallets.
          </div>
        </div>

        <div className="inner index-advantages grid-blocks two-blocks-grid">
          <div>
            <h2>
              Advantages of <br></br>Gnosis Safe contracts
            </h2>
          </div>
          <div className="index-advantages-boxes  grid-blocks two-blocks-grid">
            <a className="white-box">
              <h3>
                Formal Verification
              </h3>
              <p>
              While our code is always audited, we’ve gone one step further and <strong>formally verified</strong> the Gnosis Safe smart contracts.
              </p>
            </a>

            <a className="white-box">
              <h3>
               Meta-transactions and backend services
              </h3>
              <p>
                Use our open-source backend services to submit <strong>meta-transactions</strong> or to conveniently pull details about the entire transaction history of your Safe.
              </p>
            </a>

            <a  className="white-box">
              <h3>
                Custom logic via modules
              </h3>
              <p>
               The base Gnosis Safe contracts only contain core logic regarding owner management and multi-signature transaction execution. <strong>Custom logic</strong> such as advanced access control logic can be <strong>added via modules</strong>.
              </p>
            </a>

            <a className="white-box">
              <h3>
                Open Source
              </h3>
              <p>
                The Gnosis Safe source <strong>code is fully available</strong> under the GNU LGPL3.0 license. Dig into the code or add custom modules to your Safe.
              </p>
            </a>
          </div>
        </div>

        <div className="inner index-projects-using grid-blocks two-blocks-grid">
          <div>
           <a name="projects">
            <h2>
              Projects building on <br></br> the Gnosis Safe contracts
            </h2>
            </a>
            <p>
              The Gnosis Safe smart contracts are already used by those projects.
            </p>
          </div>

          <div className="index-projects-boxes grid-blocks three-blocks-grid">
            <a href="https://metamask.io//" className="white-box">
              <img className="index-projects-img" src="/img/metamask.jpg"></img>
            </a>
            <a href="https://burnerwallet.co/" className="white-box">
              <img className="index-projects-img" src="/img/burner.png"></img>
            </a>
           <a href="https://pepo.com/" className="white-box">
            <img className="index-projects-img" src="/img/peposq.png"></img>
            </a>
            <a href="https://unilogin.io/" className="white-box">
              <img className="index-projects-img" src="/img/universalloging.png"></img>
            </a>
            <a href="https://slock.it/" className="white-box">
              <img className="index-projects-img" src="/img/slockit.jpg"></img>
            </a>
            <a href="https://tasit.io/" className="white-box">
              <img className="index-projects-img" src="/img/tasit.png"></img>
            </a>
          </div>
        </div>

        <div className="inner index-advantages grid-blocks two-blocks-grid">
          <div>
            <a name="tutorials">
              <h2>
                Popular tutorials<br />
                With the Gnosis Safe
              </h2>
            </a>
          </div>
          <div className="index-advantages-boxes  grid-blocks two-blocks-grid">
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
            <a href="tutorials" className="white-box">
                <h3>
                    More tutorials
                </h3>
                <p>
                    Check out our other tutorials for the Gnosis Safe.
                </p>
            </a>
          </div>
        </div>

        <div className="inner index-support grid-blocks two-blocks-grid">
          <div>
            <a name="support">
              <h2>
                Support<br></br>and Community
              </h2>
            </a>
            <p>
              Reach out to us!
            </p>
          </div>
          <div className="index-support-boxes grid-blocks">
            <div id="index-support-discord">
            <a href="https://discord.gg/FPMRAwK">
                Reach out to us on Discord
            </a>
          </div>
            <div id="index-support-telegram">
            <a href="https://twitter.com/gnosisSafe">
                Follow us on Twitter
            </a>
          </div>
          </div>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );


    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
        </div>
      </div>
    );
  }
}

module.exports = Index;
