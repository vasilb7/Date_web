import React from 'react';
import { Wine, Coffee, Sunset, Film, Sparkles } from 'lucide-react';

export interface DatePlan {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tag: string;
}

export const DATE_PLANS: DatePlan[] = [
  {
    id: 'dinner',
    title: 'Уютна вечеря & вино',
    desc: 'Свещи, приятна музика, вкусна храна и разговори без край.',
    icon: <Wine className="w-5 h-5 text-rose-600" />,
    tag: 'Класика'
  },
  {
    id: 'coffee',
    title: 'Кафе, разходка & десерт',
    desc: 'Следобедна разходка, топла напитка и сладки изкушения.',
    icon: <Coffee className="w-5 h-5 text-amber-600" />,
    tag: 'Непринудено'
  },
  {
    id: 'sunset',
    title: 'Гледка на залез с питие',
    desc: 'Панорамна тераса или любимо високо място с красив залез.',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    tag: 'Романтично'
  },
  {
    id: 'cinema',
    title: 'Кино вечер с пуканки',
    desc: 'Хубав филм, уютни места и споделени усмивки.',
    icon: <Film className="w-5 h-5 text-indigo-500" />,
    tag: 'Уютно'
  },
  {
    id: 'cocktails',
    title: 'Коктейли & вечерна музика',
    desc: 'Специални коктейли, оживено настроение и танци.',
    icon: <Sparkles className="w-5 h-5 text-pink-500" />,
    tag: 'Забавно'
  }
];

export const TIME_OPTIONS = [
  'Този петък вечер',
  'Тази събота вечер',
  'Неделен следобед',
  'През идната седмица',
  'Изненадай ме с деня!'
];

export const NO_PHRASES = [
  'Не 🙈',
  'Сигурна ли си? 🥺',
  'Грешен бутон! 😉',
  'Хайде де, ще е супер! ✨',
  'Бутонът е повреден! 🛠️',
  'Опитай другия бутон 👉',
  'Няма отказване! ❤️',
  'Само „Да“ се приема! 🥂'
];
