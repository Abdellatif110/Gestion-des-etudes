import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, Eye, EyeOff, Loader2, UserPlus, LogIn } from 'lucide-react';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, signup } = useAuthStore();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    // Reset fields when switching
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          throw new Error('Invalid email or password');
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match!");
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        success = await signup(email, password);
        if (!success) {
          throw new Error('Email already exists. Please login instead.');
        }
      }

      // Navigate to app on success
      if (success) {
        navigate('/timer');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">StudyFlow</h1>
          <p className="text-slate-400">Your Learning Companion</p>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              {isLogin ? (
                <>
                  <LogIn className="w-6 h-6" />
                  Welcome Back
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6" />
                  Create Account
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isLogin ? 'Sign in to continue your learning journey' : 'Join thousands of learners worldwide'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={submitHandler} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </div>
                )}
              </Button>
            </form>

            {/* Switch Mode */}
            <div className="text-center pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={switchAuthModeHandler}
                disabled={isLoading}
                className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {isLogin ? 'New here? Create an account' : 'Already have an account? Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>© 2024 StudyFlow. Empowering learners worldwide.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
