const messagesData = [
  { id: 1, text: 'Chào bạn! Bạn khỏe không?', sent: false, time: '10:30' },
  { id: 2, text: 'Mình khỏe, cảm ơn bạn!', sent: true, time: '10:31' },
  { id: 3, text: 'Cuối tuần này mình đi chơi nhé', sent: false, time: '10:32' },
  { id: 4, text: 'Okay, đi đâu vậy?', sent: true, time: '10:33' },
];

const conversationsData = [ 
  {
    id: "1",
    name: 'Nguyễn Văn A',
    avatarUrl: "/assets/images/pexels-cottonbro-10034377.jpg",
    isOnline: true,
    lastMsg: 'Cuối tuần này mình đi chơi nhé',
    lastMsgTime: '10:32',
    unread: 2
  },
  {
    id: "2",
    name: 'Trần Thị B',
    avatarUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    isOnline: false,
    lastMsg: 'Okela, hẹn gặp lại',
    time: 'Hôm qua',
    unread: 0
  },
  {
    id: "3",
    name: 'Lê Văn C',
    avatarUrl: null,
    isOnline: true,
    lastMsg: 'Đã gửi một file',
    lastMsgTime: 'T2',
    unread: 0
  },
  {
    id: "4",
    name: 'Phạm Thị D',
    avatarUrl: null,
    isOnline: false,
    lastMsg: 'Thanks bạn nhé!',
    lastMsgTime: 'T2',
    unread: 0
  },
  {
    id: "5",
    name: 'Hoàng Văn E',
    avatarUrl: null,
    isOnline: true,
    lastMsg: 'Mình đang bận, call lại sau nhé',
    lastMsgTime: 'CN',
    unread: 1
  },
];

export { messagesData, conversationsData };