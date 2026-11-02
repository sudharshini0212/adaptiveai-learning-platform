import React from 'react';
import { RewardItem, UserProfile } from '../types';
import { 
  Gift, 
  Flame, 
  Award, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  Lock, 
  FileText, 
  BookOpen, 
  ShoppingBag, 
  Droplet, 
  PenTool, 
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardsViewProps {
  userProfile: UserProfile;
  rewards: RewardItem[];
  onUnlockReward: (rewardId: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  userProfile,
  rewards,
  onUnlockReward,
}) => {
  const handleClaim = (reward: RewardItem) => {
    if (userProfile.points >= reward.pointsCost && !reward.unlocked) {
      onUnlockReward(reward.id);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const welcomeKitItems = [
    { title: 'Ergonomic Student Backpack', desc: 'Water-resistant laptop compartment with AdaptiveAI Chennai Hackathon branding', icon: ShoppingBag },
    { title: 'Stainless Insulated Water Bottle', desc: '750ml matte double-walled thermal flask for long hackathons & study marathons', icon: Droplet },
    { title: 'Dot-Grid Smart Study Journal', desc: 'Acid-free 120gsm paper engineered for algorithm dry-runs and tree diagrams', icon: BookOpen },
    { title: 'Precision Pilot Pen Set', desc: 'Archival gel micro-point pens for clean formula derivations', icon: PenTool },
    { title: 'Laminated DSA & DBMS Flashcards', desc: 'Quick-revision formula deck covering all 5 university semester units', icon: Layers },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Gamified Mastery & Learning Points</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Rewards, Streaks & Physical Welcome Kit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Earn XP by completing daily adaptive tasks, passing mastery assessments, and maintaining consistency. Unlock exclusive placement packs and the student physical kit.
            </p>
          </div>

          {/* User Score Pill */}
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Available XP
              </span>
              <p className="text-2xl font-extrabold text-indigo-600">
                {userProfile.points} XP
              </p>
              <span className="text-xs text-slate-600 font-semibold">
                Level {userProfile.level} • Consistent Scholar
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              L{userProfile.level}
            </div>
          </div>
        </div>

        {/* XP Rules Breakdown */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-indigo-600 font-bold">+10 XP</span>
            <p className="text-slate-700 font-medium mt-0.5">Lesson Read</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-indigo-600 font-bold">+15 XP</span>
            <p className="text-slate-700 font-medium mt-0.5">Quiz Finished</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-amber-600 font-bold">+20 XP</span>
            <p className="text-slate-700 font-medium mt-0.5">Daily Plan Complete</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-rose-600 font-bold">+100 XP</span>
            <p className="text-slate-700 font-medium mt-0.5">7-Day Streak Goal</p>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Reward Store & Digital Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((rew) => {
            const canAfford = userProfile.points >= rew.pointsCost;
            return (
              <div
                key={rew.id}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 shadow-xs ${
                  rew.unlocked
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                      {rew.category}
                    </span>
                    {rew.unlocked ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{rew.pointsCost} XP</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-800">
                    {rew.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {rew.description}
                  </p>
                </div>

                <div>
                  {rew.unlocked ? (
                    <button
                      disabled
                      className="w-full py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 cursor-default"
                    >
                      Reward Active
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaim(rew)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        canAfford
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      {canAfford ? 'Claim Reward' : `Need ${rew.pointsCost - userProfile.points} more XP`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical Welcome Kit Prototype Explorer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>Smart Education Welcome Kit (Prototype)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              AdaptiveAI Physical Student Gear Pack
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Awarded to high-consistency students for campus placement & hackathon preparation.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Kit Unlock Progress:</span>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((userProfile.points / 750) * 100))}%` }}
                />
              </div>
              <span className="text-xs font-bold text-indigo-600">
                {userProfile.points}/750 XP
              </span>
            </div>
          </div>
        </div>

        {/* Kit Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {welcomeKitItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
