
import { Shield, Users } from "lucide-react";

interface TrustBadgesProps {
  userCount: number;
}

const TrustBadges = ({ userCount }: TrustBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start mb-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
        <Shield className="w-4 h-4 text-green-500" />
        <span>Your text is secure - we never store or share it!</span>
      </div>
      <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
        <Users className="w-4 h-4 text-blue-500" />
        <span>{userCount.toLocaleString()} texts checked today</span>
      </div>
    </div>
  );
};

export default TrustBadges;
