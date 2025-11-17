import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';



const ModernKPICards = ({ closingCash, openingCash, moneyIn, moneyOut }) => {
    const formatAmount = (amount) => {
        return '₹' + (amount / 100000).toFixed(2) + ' Cr';
    };

    const kpiData = [
        {
            label: 'Closing Cash',
            value: formatAmount(closingCash),
            icon: Wallet,
            gradient: 'from-red-500 to-orange-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            trend: '+2.5%',
        },
        {
            label: 'Opening Cash',
            value: formatAmount(openingCash),
            icon: DollarSign,
            gradient: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            trend: 'Baseline',
        },
        {
            label: 'Money In',
            value: formatAmount(moneyIn),
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            trend: '+18.2%',
        },
        {
            label: 'Money Out',
            value: formatAmount(moneyOut),
            icon: TrendingDown,
            gradient: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-50',
            textColor: 'text-pink-600',
            trend: '-12.3%',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
            {kpiData.map((kpi, idx) => {
                const IconComponent = kpi.icon;
                return (
                    <div
                        key={idx}
                        className=" relative flex bg-white rounded-2xl border  border-slate-200 p-4 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
                    >
                        {/* <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div> */}

                        <div className="relative w-[100%] ">
                        
                            <div className=' flex justify-between w-[100%]'>
                                <div>
                                    <p className="text-slate-600 text-sm font-medium mb-1">{kpi.label}</p>

                                    {/* Value */}
                                    <p className={`text-2xl font-bold ${kpi.textColor} mb-3`}>{kpi.value}</p>
                                </div>

                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg`}>
                                    <IconComponent size={24} className="text-white" />
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${kpi.gradient} rounded-full`}
                                    style={{ width: `${60 + idx * 10}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ModernKPICards;
