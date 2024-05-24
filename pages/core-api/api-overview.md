# Safe{Core} Infrastructure

The Safe{Core} Infrastructure consists of the following services:

## Safe Transaction Service

The Safe Transaction Service tracks transactions related to Safe contracts using tracing on Mainnet, Sepolia, and Gnosis Chain. It uses event indexing for the other chains. For each [supported network](./transaction-service-supported-networks.md) there is one instance of the Transaction Service.

- Learn about the [tech stack and how to run the service](./api-safe-transaction-service.mdx).
- Learn about the [Safe Transaction Service API](./transaction-service-overview.mdx).
- Check the [API Reference](./transaction-service-reference.mdx).
- Check the [GitHub repository](https://github.com/safe-global/safe-transaction-service) (Python).

## Safe Events Service

The Events Service handles Safe indexing events and delivers them as HTTP webhooks, connection to the events queue processed by the Transaction Service. The service's database stores the configuration of webhook destinations.

- Check the [GitHub repository](https://github.com/safe-global/safe-events-service) (NodeJS).

## Architecture

Safe{Wallet} uses these services to offer functionality to end customers via the web and mobile applications. The [Safe Client Gateway](https://github.com/safe-global/safe-client-gateway-nest) acts as a facade between the end customer and the Safe{Core} services and the [Safe Config Service](https://github.com/safe-global/safe-config-service) stores all supported networks and chain-specific variables.

Safe's production setup consists of several instances of the Transaction Service orchestrated by the Config Service, which are later consumed by the Safe Client Gateway. The Events Service notifies the Safe Client Gateway when new events are indexed, helping to improve the user experience.

![Overview of the backend services and their components.](../../assets/diagram-services.png)

## Integration Flow for Safe{Wallet} and Safe{Core}

- The Client Gateway leverages the Config Service to find the Transaction Service instance required for a specific request.
- The Client Gateway forwards the request to the specified Transaction Service instance for the supported networks (determined by the Config Service).
- The Client Gateway transforms, aggregates, and caches information from the Config and Transaction Services, optimizing data for Safe's web and mobile clients.
- The Event Service provides information to the Client Gateway when the Transaction Service indexes an event using webhooks. The Client Gateway is then responsible for providing this information to the end clients.

``` mermaid
sequenceDiagram
    box rgba(255,255,255,.1) Safe{Wallet}
    participant External Request
    participant Client Gateway
    participant Config Service
    end
    box rgba(255,255,255,.1) Safe{Core}
    participant Tx Service
    
    participant Events Service
    end
    External Request->>+Client Gateway: GET /v1/chains/1/safes/...
    Client Gateway->>+Config Service: GET /v1/chains/1
    Config Service->>+Client Gateway: 200 OK /v1/chains/1
    Client Gateway->>+Tx Service: GET /api/v1/safes/...
    Tx Service->>+Client Gateway: 200 /api/v1/safes/...
    Client Gateway->>+External Request: 200 OK /v1/chains/1/safes/...

    External Request->>+Client Gateway: POST /v1/chains/1/safes/0x000.../multisig-transactions
    Client Gateway->>+Tx Service: POST /api/v1/safes/0x000.../multisig-transactions
    Tx Service->>+Client Gateway: 201 CREATED /api/v1/safes/0x000.../multisig-transactions
    Client Gateway->>+External Request: 201 CREATED /v1/chains/1/safes/0x000.../multisig-transactions
    Events Service->>+Client Gateway: POST /v1/hooks/events
    Client Gateway->>+Events Service: 204 NO CONTENT /v1/hooks/events
    Client Gateway->>+External Request: Event notification
```

Even though the Config Service and Transaction Service instances are reachable by clients that aren't the Client Gateway, this may change in the future. The Client Gateway is the outermost component of the Safe infrastructure and should be the single point of communication with any front-end client.

## Running locally

[Safe Infrastructure](https://github.com/safe-global/safe-infrastructure) repository and the [running services locally](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_locally.md) guide show how to run Safe's infrastructure ([Safe{Wallet}](https://app.safe.global) and Safe{Core}). Note that these documents are examples of how these services run, and the configuration should adapt to the needs of a specific use case.
