import React, { useState, useRef, useEffect } from 'react';
import WebSocketComponent from '../components/WebSocket/webSocket';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: 'read' | 'unread';
}

const typeStyles: Record<NotificationType, string> = {
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  success: 'bg-green-100 text-green-800 border-green-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  error: 'bg-red-100 text-red-800 border-red-300'
};

const NotificationPage: React.FC = () => {

  const [isRead, setIsRead] = useState(false)
  const [messages, setMessages] = useState([])
  const ws = useRef<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: '0',
      title: 'New info!',
      message: 'Your info is now active.',
      type: 'info',
      status: 'read'
    },
    {
      _id: '1',
      title: 'Welcome!',
      message: 'Your dashboard is now active.',
      type: 'success',
      status: 'unread'
    },
    {
      _id: '2',
      title: 'Server Warning',
      message: 'One of the servers is running hot.',
      type: 'warning',
      status: 'read'
    },
    {
      _id: '3',
      title: 'Error Detected',
      message: 'Failed to load some resources.',
      type: 'error',
      status: 'unread'
    },
  ]);

  const dismissNotification = (_id: string) => {

    const updatedNotifications = notifications?.map((datum)=>{
      if (datum?._id == _id) {
        return {...datum, status: isRead == false ? 'read' : 'unread'}
      } else {
        return datum
      }
    })

    setNotifications(updatedNotifications);
  };

  const handleWebSocket = () => {
    
    // Replace with your WebSocket server URL
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current?.send('Hello from React!');
    };

    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };

  }

  useEffect(()=>{
    handleWebSocket()
  }, [])

  return (
    <div className="min-h-screen p-6">

      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className='flex' onClick={()=>setIsRead(!isRead)}>
          <button><span className={`p-1 rounded-s-sm text-xs cursor-pointer ${isRead==false ? `bg-blue-500 text-white font-bold` : `bg-gray-300`}`}>Unread</span></button>
          <button><span className={`p-1 rounded-e-sm text-xs cursor-pointer ${isRead==true ? `bg-blue-500 text-white font-bold` : `bg-gray-300`}`}>Read</span></button>
        </div>
      </div>

      <WebSocketComponent messages={messages} />

      <div className="space-y-4">
        {notifications?.filter((datum)=>isRead ? datum?.status == "read" : datum?.status == "unread")?.map((n) => (
          <div
            key={n._id}
            className={`border-l-4 p-4 rounded-md shadow-sm flex justify-between items-start ${n.status=="read" ? 'bg-gray-100 text-gray-800 border-gray-300' : typeStyles[n.type]}`}
          >
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm">{n.message}</p>
            </div>
            <button
              className="ml-4 text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={() => dismissNotification(n._id)}
            >
              {isRead==false ? 
              <span>✕</span> 
              :
              <span className='text-xs underline text-blue-500'>mark as unread</span>}
            </button>
          </div>
        ))}
        {(
          (isRead==true && notifications?.filter((datum)=>datum?.status=="read")?.length === 0)
          ||
          (isRead==false && notifications?.filter((datum)=>datum?.status=="unread")?.length === 0)
        ) && (
          <p className="text-gray-500 text-sm">No notifications to show.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;