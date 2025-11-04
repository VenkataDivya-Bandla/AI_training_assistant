import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeTable = ({ employees, onViewDetails, onBulkAction }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' }
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees?.map(emp => emp?.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId, checked) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees?.filter(id => id !== employeeId));
    }
  };

  const filteredEmployees = employees?.filter(emp => {
      const matchesSearch = emp?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           emp?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesDepartment = !filterDepartment || emp?.department === filterDepartment;
      const matchesStatus = !filterStatus || emp?.status === filterStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    })?.sort((a, b) => {
      const aValue = a?.[sortField];
      const bValue = b?.[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string') {
        return aValue?.localeCompare(bValue) * modifier;
      }
      return (aValue - bValue) * modifier;
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      not_started: { label: 'Not Started', color: 'bg-muted text-muted-foreground' },
      in_progress: { label: 'In Progress', color: 'bg-warning/10 text-warning border border-warning/20' },
      completed: { label: 'Completed', color: 'bg-success/10 text-success border border-success/20' },
      overdue: { label: 'Overdue', color: 'bg-error/10 text-error border border-error/20' }
    };

    const config = statusConfig?.[status] || statusConfig?.not_started;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header with filters and actions */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h2 className="text-lg font-semibold text-foreground">Employee Onboarding Progress</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="search"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={departments}
              value={filterDepartment}
              onChange={setFilterDepartment}
              placeholder="Department"
              className="w-full sm:w-40"
            />
            
            <Select
              options={statuses}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Status"
              className="w-full sm:w-40"
            />
          </div>
        </div>

        {selectedEmployees?.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-muted rounded-lg p-3">
            <span className="text-sm text-muted-foreground">
              {selectedEmployees?.length} employee(s) selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('message', selectedEmployees)}
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('assign_task', selectedEmployees)}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Assign Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export', selectedEmployees)}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.length === filteredEmployees?.length && filteredEmployees?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-muted transition-smooth"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Employee</span>
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-muted transition-smooth"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Start Date</span>
                  <Icon 
                    name={sortField === 'startDate' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-muted transition-smooth"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <Icon 
                    name={sortField === 'progress' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </div>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Mentor</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Last Activity</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee) => (
              <tr key={employee?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => handleSelectEmployee(employee?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{employee?.name}</p>
                      <p className="text-sm text-muted-foreground">{employee?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{employee?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{employee?.startDate}</span>
                </td>
                <td className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{employee?.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(employee?.progress)}`}
                        style={{ width: `${employee?.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(employee?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <span className="text-sm text-foreground">{employee?.mentor}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{employee?.lastActivity}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(employee)}
                      iconName="Eye"
                      iconSize={16}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Send message to', employee?.name)}
                      iconName="MessageSquare"
                      iconSize={16}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredEmployees?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No employees found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;