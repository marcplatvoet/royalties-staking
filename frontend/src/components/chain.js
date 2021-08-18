import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import ChainLogo from "../assets/ChainLogos";

const Chain = (props) => {
  const chainId = props.chainId;

  let chainLogo;
  let variant;
  let chainName;

  switch (chainId) {
    case 1: //ETH
      chainLogo = ChainLogo.eth;
      variant = "light";
      chainName = "Ethereum Network";
      break;
    case 56: //BNB
      chainLogo = ChainLogo.bnb;
      variant = "secondary";
      chainName = "Binance Smart Chain";
      break;
    case 128: //HT
      chainLogo = ChainLogo.ht;
      variant = "light";
      chainName = "Heco";
      break;
    case 100: //xDai
      chainLogo = ChainLogo.xdai;
      variant = "light";
      chainName = "xDai Stable Chain";
      break;
    case 137: //Polygon
      chainLogo = ChainLogo.polygon;
      variant = "light";
      chainName = "Polygon Network";
      break;
    default:
      // Unknown network
      chainLogo = ChainLogo.unknown;
      variant = "light";
      chainName = "Unknown network?";
      break;
  }

  return (
    <OverlayTrigger
      key="left"
      placement="left"
      overlay={<Tooltip id={`tooltip-left`}>{chainName}</Tooltip>}
    >
      <Button variant={variant}>
        <img src={chainLogo} width={14} alt={chainName} />
      </Button>
    </OverlayTrigger>
  );
};

export default Chain;
