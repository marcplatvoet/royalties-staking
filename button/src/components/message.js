import { React, useState } from "react";
import { Alert } from "react-bootstrap";

const Message = (props) => {
	const [show, setShow] = useState(true);
	const [messages, setMessage] = useState([]);

	const close = () => {
		setShow(false);
		setMessage(messages.filter((item, index) => index !== props.id));
	};

	if (show) {
		return (
			<Alert
				variant={props.variant ? props.variant : "dark"}
				onClose={close}
				dismissible
			>
				<Alert.Heading>{props.head}</Alert.Heading>
				<p>{props.body}</p>
			</Alert>
		);
	} else {
		return <></>;
	}
};

export default Message;
