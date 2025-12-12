import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useAuth } from '../../context/AuthContext';
import { Users, UserPlus, Trash2, Mail, User as UserIcon, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

export function ReceptionManagement() {
  const { receptionAccounts, createReceptionAccount, deleteReceptionAccount, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Only admin can access this
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                B?n không có quy?n truy c?p trang này. Ch? Admin m?i có th? qu?n lý tài kho?n Reception.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('M?t kh?u xác nh?n không kh?p.');
      return;
    }

    if (password.length < 6) {
      setError('M?t kh?u ph?i có ít nh?t 6 ký t?.');
      return;
    }

    const result = await createReceptionAccount({username, password, fullname, phone, email, role: 'employee'});
    
    if (result) {
      setSuccess('T?o tài kho?n Reception thành công!');
      setFullname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setDialogOpen(false);
        setSuccess('');
      }, 2000);
    } else {
      setError('Không th? t?o tài kho?n. Vui lòng th? l?i.');
    }
  };

  const handleDeleteAccount = (id: number) => {
    if (window.confirm('B?n có ch?c ch?n mu?n xóa tài kho?n này?')) {
      deleteReceptionAccount(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            Qu?n lý L? tân
          </h2>
          <p className="text-gray-600 mt-2">
            Qu?n lý tài kho?n nhân viên l? tân c?a khách s?n
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm tài kho?n m?i
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>T?o tài kho?n Reception m?i</DialogTitle>
              <DialogDescription>
                Nh?p thông tin ?? t?o tài kho?n cho nhân viên l? tân m?i
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateAccount} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">H? và tên</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Nguy?n V?n A"
                    className="pl-10"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="reception@hotel.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">M?t kh?u</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="????????"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nh?n m?t kh?u</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="????????"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                >
                  H?y
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  T?o tài kho?n
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">T?ng s? l? tân</p>
                <p className="text-3xl">{receptionAccounts.length}</p>
              </div>
              <Users className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">?ang ho?t ??ng</p>
                <p className="text-3xl">{receptionAccounts.length}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">M?t kh?u m?c ??nh</p>
                <p className="text-lg">reception123</p>
              </div>
              <AlertCircle className="h-10 w-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reception Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài kho?n L? tân</CardTitle>
          <CardDescription>
            Qu?n lý t?t c? tài kho?n nhân viên l? tân
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>H? và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày t?o</TableHead>
                <TableHead>Tr?ng thái</TableHead>
                <TableHead className="text-right">Hành ??ng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptionAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <span>{account.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {account.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {account.createdAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Ho?t ??ng
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {receptionAccounts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ch?a có tài kho?n l? tân nào</p>
              <p className="text-sm">Nh?n nút "Thêm tài kho?n m?i" ?? t?o tài kho?n</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
