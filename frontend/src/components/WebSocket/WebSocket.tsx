// src/components/WebSocketComponent.tsx

const WebSocketComponent = ({messages}) => {

  return (
    <div>
      <ul>
        {messages.map((msg, idx) => <li key={idx}>{msg}</li>)}
      </ul>
    </div>
  );

};

export default WebSocketComponent;