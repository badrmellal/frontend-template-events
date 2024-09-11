import { LucideProps, Loader2, AlertTriangle, XCircle, CheckCircle, Ticket, Mail, Phone, Inbox, User, Settings, Headset, LogOut, Users, Calendar, DollarSign } from 'lucide-react';
import { FaApple, FaGoogle } from 'react-icons/fa6';

export const Icons = {
  google: FaGoogle,
  apple: FaApple,
  alertTriangle: AlertTriangle,
  xCircle: XCircle,
  checkCircle: CheckCircle,
  ticket: Ticket,
  mail: Mail,
  phone: Phone,
  inbox: Inbox,
  user: User,
  settings: Settings,
  headset: Headset,
  logOut: LogOut,
  users: Users,
  calendar: Calendar,
  dollarSign: DollarSign,
  spinner: (props: LucideProps) => <Loader2 {...props} />
};
