"use client"

import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Book, MessageSquare, Users, PlusCircle, CheckCircle, Award, BookOpen, Video, FileText, BarChart, BellRing, Upload, Star, X, Save, Edit } from 'lucide-react';
import { Inter, Montserrat, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
});
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

interface StudyGroup {
  id: number;
  name: string;
  students: string[];
  color: string;
  progress: number;
}

interface Note {
  id: number;
  group: number;
  content: string;
  author: string;
  date: string;
}

interface DueDate {
  assignment: string;
  group: number;
}

interface DueDates {
  [date: string]: DueDate;
}

interface ChatMessage {
  id: number;
  group: number;
  content: string;
  author: string;
  time: string;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface Flashcards {
  [groupName: string]: Flashcard[];
}

interface GroupProgress {
  completedCards: number;
  totalCards: number;
  studyTime: number;
  quizScores: number[];
}

interface ProgressData {
  [groupName: string]: GroupProgress;
}

interface VirtualSession {
  group: StudyGroup;
  participants: string[];
  startTime: string;
  duration: number;
  topic?: string;
}

const StudyBuddy: React.FC = () => {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sessionTopic, setSessionTopic] = useState<string>('');
  const [dueDates, setDueDates] = useState<DueDates>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcards>({});
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showCardAnswer, setShowCardAnswer] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newAssignment, setNewAssignment] = useState<string>('');
  const [newCardQuestion, setNewCardQuestion] = useState<string>('');
  const [newCardAnswer, setNewCardAnswer] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('groups');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [progressData, setProgressData] = useState<ProgressData>({});
  const [virtualSession, setVirtualSession] = useState<VirtualSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<VirtualSession[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editCardQuestion, setEditCardQuestion] = useState<string>('');
  const [editCardAnswer, setEditCardAnswer] = useState<string>('');
  const [viewedChats, setViewedChats] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupMembers, setNewGroupMembers] = useState<string>('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [activityData, setActivityData] = useState<number[]>([35, 42, 28, 56, 48, 62, 44]);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [scheduledSessions, setScheduledSessions] = useState<VirtualSession[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 1000);

    const initialGroups: StudyGroup[] = [
      { id: 1, name: 'Math 101', students: ['John', 'Jane', 'Bob'], color: '#4F46E5', progress: 65 },
      { id: 2, name: 'Science 202', students: ['Alice', 'Mike', 'Emily'], color: '#7C3AED', progress: 42 },
      { id: 3, name: 'History 303', students: ['Sara', 'Tom', 'Lisa'], color: '#EC4899', progress: 78 },
    ];
    setStudyGroups(initialGroups);

    const initialNotes: Note[] = [
      { id: 1, group: 1, content: 'Differential equations can be solved using separation of variables.', author: 'Jane', date: '2024-09-15' },
      { id: 2, group: 2, content: 'The periodic table organizes elements by atomic number and electron configuration.', author: 'Mike', date: '2024-09-14' },
    ];
    setNotes(initialNotes);

    const initialDueDates: DueDates = {
      '2024-09-16': { assignment: 'Math Quiz on Derivatives', group: 1 },
      '2024-09-23': { assignment: 'Science Lab Report', group: 2 },
      '2024-09-30': { assignment: 'History Essay on Ancient Rome', group: 3 },
    };
    setDueDates(initialDueDates);

    const initialChatMessages: ChatMessage[] = [
      { id: 1, group: 1, content: 'Can someone explain how to solve problem #5?', author: 'John', time: '10:30 AM' },
      { id: 2, group: 1, content: 'Sure! You need to use the chain rule for that one.', author: 'Jane', time: '10:32 AM' },
      { id: 3, group: 2, content: 'When is our next study session?', author: 'Alice', time: '2:15 PM' },
      { id: 4, group: 2, content: "Let's meet tomorrow at the library at 4pm.", author: 'Emily', time: '2:20 PM' },
    ];
    setChatMessages(initialChatMessages);

    const initialFlashcards: Flashcards = {
      'Math 101': [
        { id: 1, question: 'What is the derivative of sin(x)?', answer: 'cos(x)' },
        { id: 2, question: 'What is the integral of 1/x?', answer: 'ln|x| + C' },
      ],
      'Science 202': [
        { id: 1, question: 'What is the chemical symbol for gold?', answer: 'Au' },
        { id: 2, question: 'What is the speed of light?', answer: '299,792,458 meters per second' },
      ],
      'History 303': [
        { id: 1, question: 'When did World War II end?', answer: '1945' },
        { id: 2, question: 'Who was the first president of the United States?', answer: 'George Washington' },
      ],
    };
    setFlashcards(initialFlashcards);

    const initialProgress: ProgressData = {
      'Math 101': {
        completedCards: 12,
        totalCards: 20,
        studyTime: 240,
        quizScores: [85, 92, 78]
      },
      'Science 202': {
        completedCards: 8,
        totalCards: 24,
        studyTime: 180,
        quizScores: [75, 82]
      },
      'History 303': {
        completedCards: 15,
        totalCards: 18,
        studyTime: 320,
        quizScores: [90, 88, 95]
      }
    };
    setProgressData(initialProgress);
    const dummyScheduledSessions: VirtualSession[] = [
      {
        group: initialGroups[0],
        participants: ['John', 'Jane', 'Bob', 'You'],
        startTime: new Date(Date.now() + 86400000).toLocaleString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' }),
        duration: 60,
      },
      {
        group: initialGroups[1],
        participants: ['Alice', 'Mike', 'Emily', 'You'],
        startTime: new Date(Date.now() + 2 * 86400000).toLocaleString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' }),
        duration: 45,
      }
    ];
    setScheduledSessions(dummyScheduledSessions);
    const dummySessionHistory: VirtualSession[] = [
      {
        group: initialGroups[0],
        participants: ['John', 'Jane', 'Bob', 'You'],
        startTime: new Date(Date.now() - 2 * 86400000).toLocaleString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' }),
        duration: 60,
      },
      {
        group: initialGroups[2],
        participants: ['Sara', 'Tom', 'Lisa', 'You'],
        startTime: new Date(Date.now() - 5 * 86400000).toLocaleString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' }),
        duration: 90,
      }
    ];
    setSessionHistory(dummySessionHistory);
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      const messageContainer = messageContainerRef.current;

      const lastMessageElement = messageContainer.lastElementChild;

      if (lastMessageElement) {
        const timerId = setTimeout(() => {
          lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 50);

        return () => clearTimeout(timerId);
      } else {
        const timerId = setTimeout(() => {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 50);
        return () => clearTimeout(timerId);
      }
    }
  }, [chatMessages]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 50) + 20;

      setActivityData(prevData => {
        const newData = [...prevData];
        newData[currentDay] = newValue;
        return newData;
      });

      setCurrentDay(prev => (prev + 1) % 7);
    }, 3000);

    return () => clearInterval(updateInterval);
  }, [currentDay]);

  const handleGroupSelect = (group: StudyGroup): void => {
    setSelectedGroup(group);
    setActiveTab('notes');
  };

  const handleNoteAdd = (): void => {
    if (newNote.trim() === '' || !selectedGroup) return;

    const note: Note = {
      id: notes.length + 1,
      group: selectedGroup?.id,
      content: newNote,
      author: 'You',
      date: new Date().toISOString().split('T')[0]
    };

    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleDueDateAdd = (): void => {
    if (!selectedGroup || newDueDate.trim() === '' || newAssignment.trim() === '') return;
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(newDueDate).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("You can't add a due date in the past.");
      return;
    }
    setDueDates({ ...dueDates, [newDueDate]: { assignment: newAssignment, group: selectedGroup?.id } });
    setNewDueDate('');
    setNewAssignment('');
  };

  const handleChatMessageAdd = (): void => {
    if (newMessage.trim() === '' || !selectedGroup) return;

    const message: ChatMessage = {
      id: chatMessages.length + 1,
      group: selectedGroup?.id,
      content: newMessage,
      author: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');

    setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleFlashcardAdd = (): void => {
    if (newCardQuestion.trim() === '' || newCardAnswer.trim() === '' || !selectedGroup) return;

    const groupCards = selectedGroup?.name && flashcards[selectedGroup.name] ? flashcards[selectedGroup.name] : [];
    const card: Flashcard = {
      id: groupCards.length + 1,
      question: newCardQuestion,
      answer: newCardAnswer
    };

    setFlashcards({
      ...flashcards,
      [selectedGroup?.name]: [...groupCards, card]
    });

    setNewCardQuestion('');
    setNewCardAnswer('');
  };

  const handleEditStart = (card: Flashcard): void => {
    setEditingCard(card);
    setEditCardQuestion(card.question);
    setEditCardAnswer(card.answer);
  };

  const handleEditCancel = (): void => {
    setEditingCard(null);
    setEditCardQuestion('');
    setEditCardAnswer('');
  };

  const handleEditSave = (): void => {
    if (!selectedGroup || !editingCard || editCardQuestion.trim() === '' || editCardAnswer.trim() === '') return;

    const groupCards = selectedGroup?.name && flashcards[selectedGroup.name] ? flashcards[selectedGroup.name] : [];
    if (!groupCards) return;
    const updatedFlashcards = groupCards.map(card =>
      card.id === editingCard.id
        ? { ...card, question: editCardQuestion, answer: editCardAnswer }
        : card
    );

    setFlashcards({
      ...flashcards,
      [selectedGroup?.name]: updatedFlashcards
    });

    setEditingCard(null);
    setEditCardQuestion('');
    setEditCardAnswer('');
  };

  const handleQuizStart = (): void => {
    const groupCards = selectedGroup?.name && flashcards[selectedGroup.name] ? flashcards[selectedGroup.name] : [];
    if (!selectedGroup || groupCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * groupCards.length);
    setCurrentCard(groupCards[randomIndex]);
    setShowCardAnswer(false);
  };

  const startVirtualSession = (): void => {
    if (!selectedGroup) return;

    const now = new Date();
    const startDate = scheduledTime ? new Date(scheduledTime) : now;

    const session: VirtualSession = {
      group: selectedGroup,
      participants: [...selectedGroup?.students, 'You'],
      startTime: startDate.toLocaleString([], { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' }),
      duration: 60,
      topic: sessionTopic || '—',
    };

    if (scheduledTime && startDate > now) {
      setScheduledSessions(prev => [...prev, session]);
    } else {
      setVirtualSession(session);
    }

    setScheduledTime('');
    setSessionTopic('');
  };

  const endVirtualSession = (): void => {
    if (virtualSession) {
      setSessionHistory(prev => [...prev, virtualSession]);
    }
    setVirtualSession(null);
  };

  const handleNextCard = (): void => {
    const groupCards = selectedGroup?.name && flashcards[selectedGroup.name] ? flashcards[selectedGroup.name] : [];
    if (!selectedGroup || groupCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * groupCards.length);
    setCurrentCard(groupCards[randomIndex]);
    setShowCardAnswer(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getUpcomingAssignments = (): [string, DueDate][] => {
    if (!selectedGroup) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Object.entries(dueDates)
      .filter(([date, assignment]) => {
        const dueDate = new Date(date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today && assignment.group === selectedGroup?.id;
      })
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .slice(0, 3);
  };

  const renderSidebar = () => (
    <>

      <div className={`w-64 ${darkMode ? 'bg-gray-900' : 'bg-gray-300'} text-white h-screen py-6 px-4 flex flex-col shadow-xl transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:relative z-40 top-0 left-0 bottom-0`}>
        <button
          onClick={() => {
            setSelectedGroup(null);
            setActiveTab('groups');
          }}
          className="mb-8 flex items-center z-10 transition-transform duration-300 hover:translate-x-1 focus:outline-none"
        >
          <div className="relative z-50">
            <div className="relative bg-emerald-600 p-2 rounded-lg shadow-inner transform transition-transform hover:scale-105 duration-300">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
          <h1 className={`cursor-pointer text-2xl font-bold ${darkMode ? 'text-white' : 'text-emerald-800'} ml-3 ${montserrat.className} flex flex-col`}>
            <span className="">StudyBuddy</span>
            <span className="text-xs font-normal -mt-1">Collaborative learning</span>
          </h1>
        </button>

        <div className={`mb-6 z-10 ${darkMode ? 'text-white' : 'text-emerald-800'}`}>
          <div className={`flex items-center mb-3`}>
            <Users size={18} className="mr-2" />
            <h2 className="text-lg font-semibold">Your Study Groups</h2>
          </div>
          <ul className="space-y-3">
            {studyGroups.map((group) => (
              <li key={group.id}>
                <button
                  className={`cursor-pointer w-full text-left p-3 rounded-xl flex items-center transition-all duration-300 ${selectedGroup && selectedGroup?.id === group.id
                    ? `${darkMode ? 'bg-emerald-800' : 'bg-emerald-700'} text-white shadow-md translate-x-1`
                    : `hover:${darkMode ? 'bg-gray-200' : 'bg-gray-700'} ${darkMode ? 'text-white' : 'text-emerald-800'} hover:text-white`
                    }`}
                  onClick={() => handleGroupSelect(group)}
                >
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: group.color }}></div>
                  {group.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedGroup && (
          <div className="mb-4">
            <div className={`flex items-center ${darkMode ? 'text-white' : 'text-emerald-800'} mb-2`}>
              <Users size={18} className="mr-2" />
              <h2 className="text-lg font-semibold">Group Members</h2>
            </div>
            <ul className="space-y-1">
              {selectedGroup?.students.map((student, index) => (
                <li key={index} className={`flex items-center p-1 ${darkMode ? 'text-white' : 'text-emerald-800'}`}>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center mr-2 text-xs transform transition-transform hover:scale-110 duration-200">
                    {student[0]}
                  </div>
                  {student}
                </li>
              ))}
              <li className={`flex items-center p-1 ${darkMode ? 'text-white' : 'text-emerald-800'}`}>
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center mr-2 text-xs transform transition-transform hover:scale-110 duration-200">
                  Y
                </div>
                You
              </li>
            </ul>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-700 z-10">
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer w-full flex items-center justify-center p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
          >
            <PlusCircle size={18} className="mr-2 text-white" />
            <span className="text-white font-medium">Create New Study Group</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderNavTabs = () => (
    <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-md relative transition-colors duration-300 w-full`}>
      <div className="flex justify-between items-center px-2 sm:px-6 py-1 relative overflow-x-auto w-full">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-full bg-emerald-600 text-white shadow-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Users size={20} />}
        </button>
        <nav className="flex space-x-1 overflow-x-auto hide-scrollbar">
          {selectedGroup && [
            { id: 'notes', label: 'Notes', icon: <Book size={18} />, color: 'emerald' },
            { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} />, color: 'emerald' },
            { id: 'chat', label: 'Chat', icon: <MessageSquare size={18} />, color: 'emerald' },
            { id: 'flashcards', label: 'Flashcards', icon: <Award size={18} />, color: 'amber' },
            { id: 'sessions', label: 'Live Sessions', icon: <Video size={18} />, color: 'emerald' },
            { id: 'progress', label: 'Progress', icon: <BarChart size={18} />, color: 'emerald' }
          ].map((tab) => (
            <div key={tab.id} className="relative">
              <button
                className={`cursor-pointer px-2 sm:px-4 py-3 flex items-center space-x-1 sm:space-x-2 border-b-2 font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                  ? darkMode
                    ? `text-${tab.color}-400 border-${tab.color}-500`
                    : `text-${tab.color}-600 border-${tab.color}-500`
                  : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }`}
                style={{
                  borderBottomColor: activeTab === tab.id ?
                    (tab.color === 'amber' ? '#D97706' : '#10B981') : 'transparent'
                }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                  if (tab.id === 'chat' && selectedGroup) {
                    setViewedChats(prev => [...prev, selectedGroup?.id]);
                  }
                }}
              >
                <span className={activeTab === tab.id ?
                  darkMode ? `text-${tab.color}-400` : `text-${tab.color}-500`
                  : darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.id === 'chat' &&
                  chatMessages.filter(msg => msg.group === selectedGroup?.id).length > 0 &&
                  !viewedChats.includes(selectedGroup?.id) && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                      {chatMessages.filter(msg => msg.group === selectedGroup?.id).length}
                    </span>
                  )}
              </button>
            </div>
          ))}
        </nav>

        <div className="flex space-x-2 sm:space-x-3 items-center">
          <button
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-full transition-all duration-300 transform hover:scale-110 flex-wrap`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            ) : (
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            )}
          </button>
          <div className="relative">
            <button
              className={`p-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-full transition-all duration-300 transform hover:scale-110`}
              onClick={() => setShowNotification(!showNotification)}
            >
              <BellRing size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!selectedGroup) {
      return (
        <div className={`flex-1 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-8 transition-colors duration-300`}>
          <div className="text-center max-w-md animate-fade-in">
            <div className="mb-8">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-full inline-block shadow-lg transform transition-transform hover:scale-105 duration-300`}>
                <Users size={64} className="text-teal-600 mx-auto" />
              </div>
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4 ${montserrat.className}`}>
              Welcome to StudyBuddy!
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 text-lg`}>
              Select a study group from the sidebar to start collaborating with your peers,
              or create a new study group to invite classmates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] flex flex-col items-center`}>
                <div className="bg-teal-500 p-5 rounded-xl mb-5 text-white transform transition-transform hover:rotate-3 hover:scale-110 duration-300">
                  <FileText size={40} />
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Share Materials</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>Upload and share study materials with your classmates</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] flex flex-col items-center`}>
                <div className="bg-amber-500 p-5 rounded-xl mb-5 text-white transform transition-transform hover:rotate-3 hover:scale-110 duration-300">
                  <Video size={40} />
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Study Together</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>Join virtual study sessions with video and screen sharing</p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer px-8 py-4 bg-teal-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Create New Study Group
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'notes':
        return renderNotes();
      case 'calendar':
        return renderCalendar();
      case 'chat':
        return renderChat();
      case 'flashcards':
        return renderFlashcards();
      case 'sessions':
        return renderVirtualSessions();
      case 'progress':
        return renderProgress();
      default:
        return renderNotes();
    }
  };

  const renderNotes = () => (
    <div className={`p-4 sm:p-8 flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto transition-colors duration-300 w-full`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3 flex items-center ${montserrat.className}`}>
            <Book size={24} className="mr-3 text-teal-500" />
            <span className="relative inline-block">
              {selectedGroup?.name} Notes
              <span className="absolute -bottom-1 left-0 h-1 bg-teal-500 w-full rounded-full"></span>
            </span>
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Share and review course notes with your group members.
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6 rounded-xl shadow-md mb-8 transition-all duration-300 transform hover:shadow-lg`}>
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Add New Note</h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className={`w-full p-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4 shadow-sm transition-colors duration-300`}
            rows={3}
            placeholder="Type your notes here..."
          ></textarea>
          <div>
            <button
              onClick={handleNoteAdd}
              className="cursor-pointer px-6 py-3 bg-teal-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 flex items-center shadow-md transform hover:translate-y-[-2px]"
            >
              <PlusCircle size={18} className="mr-2" />
              Share Note
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {notes
            .filter((note) => note.group === selectedGroup?.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((note, index) => (
              <div
                key={note.id}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md border-l-4 border-teal-500 mb-4 transition-all duration-300 transform hover:shadow-lg animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-medium mr-3 transform transition-transform hover:scale-110 duration-200">
                      {note.author[0]}
                    </div>
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} text-lg`}>{note.author}</span>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-500 bg-gray-700' : 'text-gray-500 bg-gray-100'} px-3 py-1 rounded-full transition-colors duration-300`}>{formatDate(note.date)}</span>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line text-lg`}>{note.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className={`p-8 flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3 flex items-center ${montserrat.className}`}>
            <Calendar size={24} className="mr-3 text-teal-500" />
            <span className="relative inline-block">
              {selectedGroup?.name} Calendar
              <span className="absolute -bottom-1 left-0 h-1 bg-teal-500 w-full rounded-full"></span>
            </span>
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Keep track of upcoming assignments, quizzes, and study sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm transition-all duration-300 transform hover:shadow-md`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Add New Due Date</h3>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className={`cursor-pointer w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-700'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Assignment</label>
                <input
                  type="text"
                  value={newAssignment}
                  onChange={(e) => setNewAssignment(e.target.value)}
                  className={`w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-800 text-gray-300' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300`}
                  placeholder="e.g., Math Quiz Chapter 5"
                />
              </div>
              <button
                onClick={handleDueDateAdd}
                className="cursor-pointer w-full px-4 py-2 bg-teal-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                Add to Calendar
              </button>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm transition-all duration-300 transform hover:shadow-md`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Upcoming Assignments</h3>
            {getUpcomingAssignments().length > 0 ? (
              <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {getUpcomingAssignments().map(([date, assignment], index) => (
                  <li key={date} className={`py-3 transition-transform duration-300 hover:translate-x-1 animate-fade-in`} style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="flex justify-between">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{assignment.assignment}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(date)}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${new Date(date) <= new Date(new Date().setDate(new Date().getDate() + 2))
                          ? darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                          : darkMode ? 'bg-teal-900/30 text-emerald-400' : 'bg-emerald-100 text-teal-800'
                          } transition-colors duration-300`}>
                          {new Date(date) <= new Date(new Date().setDate(new Date().getDate() + 2))
                            ? 'Due Soon!'
                            : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} italic`}>No upcoming assignments</p>
            )}
          </div>
        </div>

        <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm transition-all duration-300 transform hover:shadow-md`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>All Assignments</h3>
          <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {Object.entries(dueDates)
              .filter(([_, assignment]) => assignment.group === selectedGroup?.id)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([date, assignment], index) => (
                <li key={date} className={`py-3 flex items-center transition-all duration-300 hover:bg-opacity-50 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-lg px-2 animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`${darkMode ? 'bg-teal-900/50 text-emerald-400' : 'bg-teal-100 text-emerald-800'} p-2 rounded-lg mr-3 text-center min-w-16 transition-all duration-300 transform hover:scale-105`}>
                    <div className="text-sm font-medium">{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div className="text-xl font-bold">{new Date(date).getDate()}</div>
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{assignment.assignment}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                      <Clock size={14} className="mr-1" />
                      {formatDate(date)}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-sm transition-colors duration-300`}>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} flex items-center ${montserrat.className}`}>
          <MessageSquare size={20} className="mr-2 text-emerald-600" />
          <span className="relative inline-block">
            {selectedGroup?.name} Discussion
            <span className="absolute -bottom-1 left-0 h-1 bg-teal-500 w-full"></span>
          </span>
        </h2>
      </div>

      <div
        ref={messageContainerRef}
        className={`flex-1 overflow-y-auto px-2 sm:px-4 pt-4 pb-10 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300 chat-container`}
        style={{ scrollBehavior: 'smooth', paddingBottom: '20px' }}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {chatMessages
            .filter((message) => message.group === selectedGroup?.id)
            .map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.author === 'You' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-3 transform transition-all duration-300 hover:shadow-md ${message.author === 'You'
                    ? 'bg-teal-600 text-white rounded-br-none hover:translate-x-[-2px]'
                    : darkMode ? 'bg-gray-800 border border-gray-700 rounded-bl-none shadow-sm hover:translate-x-[2px]' : 'bg-white border border-gray-200 rounded-bl-none shadow-sm hover:translate-x-[2px]'
                    }`}
                >
                  <div className="flex justify-between items-center mb-1 space-x-4">
                    <span className={`font-medium text-sm ${message.author === 'You' ? 'text-emerald-100' : darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {message.author}
                    </span>
                    <span className={`text-xs ${message.author === 'You' ? 'text-emerald-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {message.time}
                    </span>
                  </div>
                  <p className={message.author === 'You' ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-800'}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={`sticky bottom-0 p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`flex-1 p-2 sm:p-3 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-l-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300`}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleChatMessageAdd()}
            />
            <button
              onClick={handleChatMessageAdd}
              className="cursor-pointer px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-r-lg transition-all duration-300 transform hover:translate-x-[1px]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFlashcards = () => (
    <div className={`p-8 flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3 flex items-center ${montserrat.className}`}>
            <Award size={24} className="mr-3 text-amber-500" />
            <span className="relative inline-block">
              {selectedGroup?.name} Flashcards
              <span className="absolute -bottom-1 left-0 h-1 bg-amber-500 w-full rounded-full"></span>
            </span>
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Create and study flashcards to prepare for exams.
          </p>
        </div>

        {currentCard ? (
          <div className="mb-8 animate-fade-in">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Quiz Mode</h3>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-100'} p-8 rounded-xl shadow-lg border-2 mb-6 transition-all duration-500 transform hover:shadow-xl`}>
              <div className="text-center">
                <p className={`text-2xl font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} p-4 rounded-xl`}>
                  {currentCard.question}
                </p>

                {showCardAnswer ? (
                  <div className="mt-6">
                    <div className={`p-6 ${darkMode ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500'} border-l-4 rounded-xl ${darkMode ? 'text-green-400' : 'text-green-800'} mb-6 shadow-md transition-all duration-500 animate-fade-in`}>
                      <p className="font-medium text-xl">{currentCard.answer}</p>
                    </div>
                    <div className="flex space-x-4 justify-center mt-8">
                      <button
                        onClick={handleNextCard}
                        className="cursor-pointer px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-300 font-medium text-lg shadow-md transform hover:translate-y-[-2px] hover:shadow-lg"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowCardAnswer(true)}
                      className="cursor-pointer px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-300 font-medium text-lg shadow-md mt-4 transform hover:translate-y-[-2px] hover:shadow-lg"
                    >
                      Show Answer
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setCurrentCard(null)}
                className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-800"} font-medium transition-colors duration-300 cursor-pointer`}
              >
                Exit Quiz Mode
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm transition-all duration-300 transform hover:shadow-md`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Add New Flashcard</h3>
                <div className="space-y-3 w-full">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Question</label>
                    <input
                      type="text"
                      value={newCardQuestion}
                      onChange={(e) => setNewCardQuestion(e.target.value)}
                      className={`flex-1 p-2 sm:p-3 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300`}
                      placeholder="Enter a question"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Answer</label>
                    <textarea
                      value={newCardAnswer}
                      onChange={(e) => setNewCardAnswer(e.target.value)}
                      className={`w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300`}
                      placeholder="Enter the answer"
                      rows={3}
                    ></textarea>
                  </div>
                  <button
                    onClick={handleFlashcardAdd}
                    className="cursor-pointer w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    Create Flashcard
                  </button>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm transition-all duration-300 transform hover:shadow-md`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Start Studying</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Test your knowledge with the flashcards you and your group members have created.
                </p>
              <button
                onClick={handleQuizStart}
                disabled={
                  !((selectedGroup?.name && flashcards[selectedGroup.name]?.length))
                }
                className={`w-full px-6 py-4 rounded-xl flex items-center justify-center font-medium text-lg ${
                  !((selectedGroup?.name && flashcards[selectedGroup.name]?.length))
                    ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white transition-all duration-300 shadow-md transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer'
                  }`}
              >
                <Award size={22} className="mr-2" />
                Start Quiz Mode
              </button>
              {(() => {
                const groupName = selectedGroup?.name;
                const groupCards = groupName && flashcards[groupName] ? flashcards[groupName] : [];
                return groupName && groupCards.length === 0;
              })() && (
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2 text-center`}>
                    Create flashcards first to start studying
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Your Flashcards</h3>
              {(() => {
                const groupCards = selectedGroup?.name && flashcards[selectedGroup.name] ? flashcards[selectedGroup.name] : [];
                return groupCards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {editingCard ? (
                      <div className={`${darkMode ? 'bg-gray-800 border-amber-700' : 'bg-white border-amber-300'} p-5 rounded-xl shadow-lg border-2 col-span-1 sm:col-span-2 lg:col-span-3 animate-fade-in`}>
                        <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-4 flex items-center`}>
                          <span className="text-lg">Editing Card</span>
                        </h4>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Question</label>
                            <input
                              type="text"
                              value={editCardQuestion}
                              onChange={(e) => setEditCardQuestion(e.target.value)}
                              className={`flex-1 p-2 sm:p-3 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Answer</label>
                            <input
                              type="text"
                              value={editCardAnswer}
                              onChange={(e) => setEditCardAnswer(e.target.value)}
                              className={`flex-1 p-2 sm:p-3 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300`}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={handleEditCancel}
                            className={`cursor-pointer px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-all duration-300 flex items-center`}
                          >
                            <X size={16} className="mr-1" />
                            Cancel
                          </button>
                          <button
                            onClick={handleEditSave}
                            className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 flex items-center"
                          >
                            <Save size={16} className="mr-1" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {groupCards.map((card, index) => (
                      <div
                        key={card.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-amber-600' : 'bg-white border-amber-100 hover:border-amber-300'} p-5 rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-2px] relative animate-fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`mb-3 pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-2 flex items-center`}>
                            <span className={`w-6 h-6 rounded-full ${darkMode ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-600'} flex items-center justify-center mr-2 text-xs font-bold`}>Q</span>
                            Question:
                          </h4>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-800'} pl-8`}>
                            {card.question}
                          </p>
                        </div>

                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-2 flex items-center`}>
                            <span className={`w-6 h-6 rounded-full ${darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'} flex items-center justify-center mr-2 text-xs font-bold`}>A</span>
                            Answer:
                          </h4>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-800'} pl-8`}>
                            {card.answer}
                          </p>
                        </div>

                        <button
                          className={`absolute top-2 right-2 opacity-75 hover:opacity-100 transition-opacity duration-300 p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-50'}`}
                          onClick={() => handleEditStart(card)}
                          aria-label="Edit flashcard"
                        >
                          <Edit size={16} className={`${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} italic`}>No flashcards created yet</p>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderVirtualSessions = () => (
    <div className={`p-6 flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 flex items-center ${montserrat.className}`}>
            <Video size={24} className="mr-3 text-emerald-600" />
            <span className="relative inline-block">
              {selectedGroup?.name} Live Study Sessions
              <span className="absolute -bottom-1 left-0 h-1 bg-teal-500 w-full rounded-full"></span>
            </span>
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Participate in virtual study sessions with your group members.
          </p>
        </div>

        {virtualSession ? (
          <div className={`${darkMode ? 'bg-teal-900/20 border-teal-700' : 'bg-emerald-50 border-teal-200'} border rounded-lg p-6 mb-6 transition-all duration-300 transform hover:shadow-lg animate-fade-in`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'} mb-1`}>Live Session in Progress</h3>
                <p className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>
                  Started at {virtualSession.startTime} • {virtualSession.duration} minutes
                </p>
              </div>
              <button
                onClick={endVirtualSession}
                className="cursor-pointer px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 text-sm font-medium transform hover:translate-y-[-2px]"
              >
                End Session
              </button>
            </div>

            <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4 transition-transform duration-300 transform hover:scale-[1.01]">
              <div className="text-white text-center">
                <Video size={48} className="mx-auto mb-2 opacity-50 animate-pulse" />
                <p className="text-lg font-medium">Video Session Active</p>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 transition-colors duration-300`}>
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Participants ({virtualSession.participants.length})</h4>
              <div className="flex flex-wrap gap-2">
                {virtualSession.participants.map((participant, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${darkMode ? 'bg-teal-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-800'} px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {participant}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md hover:translate-y-[-2px]`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Start a Study Session</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                Invite your group members to study together with video and screen sharing.
              </p>

              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Session Topic (optional)
              </label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                className={`w-full p-2 mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-700'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300`}
                placeholder="e.g., Chapter 3: Organic Chemistry"
              />
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Schedule for later (optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={`w-full p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-700'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 mb-4`}
              />
              <button
                onClick={startVirtualSession}
                className="cursor-pointer w-full px-4 py-3 bg-teal-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center transform hover:translate-y-[-2px]"
              >
                <Video size={20} className="mr-2" />
                Start New Session
              </button>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md hover:translate-y-[-2px]`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Upcoming Study Sessions</h3>
              <div className="space-y-3">
                {scheduledSessions.length > 0 ? (
                  scheduledSessions.map((session, index) => (
                    <div key={index} className={`border-l-4 border-teal-500 ${darkMode ? 'bg-teal-900/20' : 'bg-emerald-50'} p-3 rounded-r-lg transition-all duration-300 transform hover:translate-x-1`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{session.group.name} Scheduled Session</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{session.startTime}</p>
                          <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Topic: {session.topic || '—'}</p>
                        </div>
                        <span className={`${darkMode ? 'bg-teal-900/30 text-emerald-300' : 'bg-teal-100 text-emerald-800'} text-xs font-medium px-2 py-1 rounded`}>
                          {session.participants.length} participants
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'} italic`}>No upcoming sessions</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Study Session History</h3>
          <div className={`overflow-hidden rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'} border`}>
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Duration</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Participants</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Topics</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {sessionHistory.map((session, index) => (
                  <tr key={index} className={`transition-colors duration-300 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{session.startTime}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{session.duration} mins</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{session.participants.length}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{session.topic || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className={`p-8 flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3 flex items-center ${montserrat.className}`}>
            <BarChart size={24} className="mr-3 text-emerald-500" />
            <span className="relative inline-block">
              {selectedGroup?.name} Study Progress
              <span className="absolute -bottom-1 left-0 h-1 bg-teal-500 w-full rounded-full"></span>
            </span>
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Track your learning progress and study statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-teal-100'} p-6 rounded-xl shadow-md border transition-all duration-300 transform hover:shadow-lg hover:translate-y-[-2px]`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Flashcards Mastered</h3>
              <span className={`${darkMode ? 'bg-teal-900/30 text-emerald-400' : 'bg-teal-100 text-emerald-800'} text-xs font-medium px-3 py-1 rounded-full transition-colors duration-300`}>
                {(selectedGroup?.name && progressData[selectedGroup.name]?.completedCards) || 0}/{(selectedGroup?.name && progressData[selectedGroup.name]?.totalCards) || 0}
              </span>
            </div>

            <div className="flex items-center">
              <div className={`text-3xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mr-3`}>
                {(selectedGroup?.name && progressData[selectedGroup.name])
                  ? Math.round((progressData[selectedGroup.name].completedCards / progressData[selectedGroup.name].totalCards) * 100)
                  : 0}% 
              </div>
              <div className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 overflow-hidden shadow-inner relative`}>
                <div
                  className="bg-teal-500 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: `${(selectedGroup?.name && progressData[selectedGroup.name])
                      ? (progressData[selectedGroup.name].completedCards / progressData[selectedGroup.name].totalCards) * 100
                      : 0}%`
                  }}
                >
                  {(selectedGroup?.name && progressData[selectedGroup.name]) &&
                    progressData[selectedGroup.name].completedCards > 0 &&
                    (progressData[selectedGroup.name].completedCards / progressData[selectedGroup.name].totalCards) * 100 > 20 && (
                      <span className="text-xs text-white font-bold">
                        {Math.round((progressData[selectedGroup.name].completedCards / progressData[selectedGroup.name].totalCards) * 100)}%
                      </span>
                    )}
                </div>
                <div className="absolute inset-0 w-full h-full flex">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 border-r ${darkMode ? 'border-gray-600' : 'border-gray-300'} last:border-r-0`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md hover:translate-y-[-2px]`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Study Time</h3>
              <span className={`${darkMode ? 'bg-teal-900/30 text-emerald-400' : 'bg-teal-100 text-emerald-800'} text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300`}>
                This Week
              </span>
            </div>
            <div className="flex items-end">
              <div className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mr-2`}>
                {Math.floor(((selectedGroup?.name && progressData[selectedGroup.name]?.studyTime) || 0) / 60)}h {((selectedGroup?.name && progressData[selectedGroup.name]?.studyTime) || 0) % 60}m
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md hover:translate-y-[-2px]`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Quiz Performance</h3>
              <span className={`${darkMode ? 'bg-teal-900/30 text-emerald-400' : 'bg-teal-100 text-emerald-800'} text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300`}>
                Average
              </span>
            </div>
            <div className="flex items-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mr-2`}>
                {(selectedGroup?.name && progressData[selectedGroup.name]?.quizScores)
                  ? Math.round(progressData[selectedGroup.name].quizScores.reduce((a, b) => a + b, 0) / progressData[selectedGroup.name].quizScores.length)
                  : 0}%
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${star <= 4 ? 'text-amber-400 fill-amber-400' : darkMode ? 'text-gray-600' : 'text-gray-300'} transition-colors duration-300`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Study Activity</h3>
            <div className={`h-48 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg p-4 transition-colors duration-300`}>
              <div className="flex justify-between items-center mb-3">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Daily study minutes
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-teal-900/30 text-emerald-400' : 'bg-teal-100 text-emerald-800'}`}>
                  Last 7 days
                </div>
              </div>

              <div className="flex items-end justify-between h-28 gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full rounded-t-md transition-all duration-1000 ${index === currentDay
                        ? darkMode ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                        : darkMode ? 'bg-teal-700/70' : 'bg-teal-500/90'
                        }`}
                      style={{
                        height: `${activityData[index]}%`,
                        maxHeight: '100%'
                      }}
                    ></div>
                    <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-1">
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${darkMode ? 'bg-emerald-500' : 'bg-emerald-500'}`}></span>
                  Current session
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                  Avg: {Math.round(activityData.reduce((sum, val) => sum + val, 0) / activityData.length)} min/day
                </div>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Achievement Badges</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-teal-900/30' : 'bg-emerald-100'} flex items-center justify-center mb-2 transition-all duration-300 transform hover:scale-110`}>
                  <Award size={32} className={darkMode ? "text-emerald-400" : "text-emerald-600"} />
                </div>
                <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Perfect Score</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'} flex items-center justify-center mb-2 transition-all duration-300 transform hover:scale-110`}>
                  <Clock size={32} className={darkMode ? "text-amber-400" : "text-amber-600"} />
                </div>
                <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Study Streak</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-2 transition-all duration-300 transform hover:scale-110`}>
                  <MessageSquare size={32} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                </div>
                <span className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Collaborator</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border transition-all duration-300 transform hover:shadow-md`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Daily Study Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Flashcards (15/20)</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>75%</span>
              </div>
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 transition-colors duration-300`}>
                <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Study Time (45/60 min)</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>75%</span>
              </div>
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 transition-colors duration-300`}>
                <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Practice Problems (2/5)</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>40%</span>
              </div>
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 transition-colors duration-300`}>
                <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCreateGroup = (): void => {
    if (newGroupName.trim() === '' || newGroupMembers.trim() === '') return;

    const colors = ['#10B981', '#059669', '#047857', '#0F766E', '#0E7490'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newGroup: StudyGroup = {
      id: studyGroups.length + 1,
      name: newGroupName,
      students: newGroupMembers.split(',').map(name => name.trim()),
      color: randomColor,
      progress: 0
    };

    const updatedGroups = [...studyGroups, newGroup];
    setStudyGroups(updatedGroups);

    setFlashcards({
      ...flashcards,
      [newGroupName]: []
    });

    setProgressData({
      ...progressData,
      [newGroupName]: {
        completedCards: 0,
        totalCards: 0,
        studyTime: 0,
        quizScores: []
      }
    });

    setSelectedGroup(newGroup);
    setActiveTab('notes');
    setSidebarOpen(false);

    setShowModal(false);
    setNewGroupName('');
    setNewGroupMembers('');

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const styles = `
  
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }


.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-chat-in {
  animation: fadeIn 0.3s ease-out forwards;
  animation-iteration-count: 1;
}

  .animate-fade-in-right {
    animation: fadeInRight 0.5s ease-out forwards;
  }
 
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
 
  @media (max-width: 640px) {
    .responsive-padding {
      padding: 1rem;
    }
    
    .responsive-text {
      font-size: 0.875rem;
    }
  }

@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr;
  }
  
  .responsive-padding {
    padding: 1rem;
  }
  
  .chat-container {
    height: calc(100vh - 180px);
  }
}

@media (max-width: 480px) {
  .responsive-text-sm {
    font-size: 0.875rem;
  }
  
  .responsive-button {
    padding: 0.5rem 1rem;
  }
}

  `;

  return (
    <div className={`${poppins.className} antialiased ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300 relative`}>
      <style>{styles}</style>
      {renderSidebar()}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
        <div className={`absolute top-4 left-4 z-50 lg:hidden ${!sidebarOpen && activeTab === 'groups' ? 'block' : 'hidden'}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full bg-emerald-600 text-white shadow-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Users size={20} />}
          </button>
        </div>
        {selectedGroup && renderNavTabs()}
        {renderContent()}

        {showNotification && (
          <div className={`fixed top-20 right-4 w-[90vw] sm:w-80 md:max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border-l-4 border-emerald-500 p-4 flex items-start animate-fade-in-right transition-all duration-300 z-50`}>
            <div className="bg-emerald-500 p-3 rounded-lg mr-3 text-white shadow-md">
              <CheckCircle size={24} className="animate-pulse" />
            </div>
            <div>
              <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>Study Group Created!</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your new  group has been created. You can now add notes, flashcards, and invite members to study together.
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              &times;
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Create New Study Group</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateGroup();
              }}>
                <div className="w-full space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className={`flex-1 p-2 sm:p-3 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder="e.g., Physics 101"
                      required
                    />
                  </div>

                  <div>
                    <label className={`w-full block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Group Members (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newGroupMembers}
                      onChange={(e) => setNewGroupMembers(e.target.value)}
                      className={`flex-1 p-2 sm:p-3 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-200 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder="e.g., Alex, Jamie, Taylor"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="cursor-pointer w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] flex items-center justify-center"
                    >
                      <PlusCircle size={18} className="mr-2" />
                      Create Group
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyBuddy;