import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const OnboardingChart = ({ type = 'funnel', data, title }) => {
  const COLORS = ['#2563EB', '#059669', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const renderFunnelChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="stage" 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderCompletionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderTrendChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="completionRate" 
          stroke="#2563EB" 
          strokeWidth={3}
          dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="satisfactionScore" 
          stroke="#059669" 
          strokeWidth={3}
          dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (type) {
      case 'completion':
        return renderCompletionChart();
      case 'trend':
        return renderTrendChart();
      default:
        return renderFunnelChart();
    }
  };

  const renderLegend = () => {
    if (type === 'completion') {
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data?.map((entry, index) => (
            <div key={entry?.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <span className="text-sm text-foreground">{entry?.name}</span>
              <span className="text-sm text-muted-foreground">({entry?.value})</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'trend') {
      return (
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-foreground">Completion Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-foreground">Satisfaction Score</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      
      <div className="w-full" aria-label={`${title} Chart`}>
        {renderChart()}
      </div>
      
      {renderLegend()}
    </div>
  );
};

export default OnboardingChart;