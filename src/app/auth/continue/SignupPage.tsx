import React, { useState } from 'react';
import { ArrowLeft, Key, Mail, Phone, ShieldCheck, UserCheck, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SignupPageProps {
    provider?: string;
    onBack?: () => void;
}

export default function SignupPage({ provider, onBack }: SignupPageProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        const formatted = formatPhone(value);
        setFormData(prev => ({ ...prev, phone: formatted }));
    };

    const formatPhone = (value: string) => {
        const onlyNums = value.replace(/\D/g, '');
        if (onlyNums.length < 4) return onlyNums;
        if (onlyNums.length < 8) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    };

    const handleCheckboxChange = (field: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [field]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 폼 검증
        if (!formData.email || !formData.phone || !formData.agreeTerms || !formData.agreePrivacy) {
            alert('필수 항목을 모두 입력해주세요.');
            setIsLoading(false);
            return;
        }

        try {
            // 실제 API 호출 로직
            console.log('회원가입 데이터:', formData);
            // 성공 시 대시보드로 이동
            setTimeout(() => {
                setIsLoading(false);
                alert('회원가입이 완료되었습니다!');
            }, 1000);
        } catch (error) {
            console.error('회원가입 실패:', error);
            setIsLoading(false);
        }
    };

    const isFormValid =
        formData.email && formData.phone && formData.agreeTerms && formData.agreePrivacy;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                {/* 헤더 영역 */}
                <div className="space-y-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="p-0 h-auto hover:bg-transparent"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            이전으로
                        </Button>
                    )}

                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl tracking-tight">가입 완료하기</h1>
                        </div>
                        <p className="text-muted-foreground">
                            서비스 이용을 위한 추가 정보를 입력해주세요
                        </p>
                    </div>
                </div>

                {/* 폼 카드 */}
                <Card>
                    <CardHeader>
                        <CardTitle>추가 정보 입력</CardTitle>
                        <CardDescription>
                            이메일과 전화번호를 입력하여 계정을 완성해주세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {/* 이메일 입력 */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center space-x-2"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>이메일 주소 *</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    required
                                />
                            </div>

                            {/* 비밀번호 입력 */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center space-x-2"
                                >
                                    <Key className="h-4 w-4" />
                                    <span>비밀번호 *</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호"
                                    value={formData.password}
                                    onChange={e => handleInputChange('password', e.target.value)}
                                    required
                                />
                            </div>

                            {/* 비밀번호 확인 입력 */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password-confirm"
                                    className="flex items-center space-x-2"
                                >
                                    {/* 아이콘 추천 Key 말고 */}
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>비밀번호 확인 *</span>
                                </Label>
                                <Input
                                    id="password-confirm"
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    value={formData.passwordConfirm}
                                    onChange={e => handleInputChange('passwordConfirm', e.target.value)}
                                    required
                                />
                            </div>

                            {/* 전화번호 입력 */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="flex items-center space-x-2"
                                >
                                    <Phone className="h-4 w-4" />
                                    <span>전화번호 *</span>
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="010-1234-5678"
                                    value={formData.phone}
                                    onChange={e => handleInputChange('phone', e.target.value)}
                                    required
                                />
                            </div>

                            {/* 약관 동의 */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="space-y-3">
                                    <div className="flex space-x-3 items-center">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.agreeTerms}
                                            onCheckedChange={checked =>
                                                handleCheckboxChange(
                                                    'agreeTerms',
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        <div className="flex gap-1">
                                            <Label
                                                htmlFor="terms"
                                                className="text-sm cursor-pointer"
                                            >
                                                <span className="text-destructive">*</span> 서비스
                                                이용약관에 동의합니다
                                            </Label>
                                            <button
                                                type="button"
                                                className="text-xs text-muted-foreground hover:text-primary underline"
                                            >
                                                약관 보기
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="privacy"
                                            checked={formData.agreePrivacy}
                                            onCheckedChange={checked =>
                                                handleCheckboxChange(
                                                    'agreePrivacy',
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        <div className="flex gap-1">
                                            <Label
                                                htmlFor="privacy"
                                                className="text-sm cursor-pointer"
                                            >
                                                <span className="text-destructive">*</span> 개인정보
                                                처리방침에 동의합니다
                                            </Label>
                                            <button
                                                type="button"
                                                className="text-xs text-muted-foreground hover:text-primary underline"
                                            >
                                                방침 보기
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="marketing"
                                            checked={formData.agreeMarketing}
                                            onCheckedChange={checked =>
                                                handleCheckboxChange(
                                                    'agreeMarketing',
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="marketing"
                                                className="text-sm cursor-pointer"
                                            >
                                                마케팅 정보 수신에 동의합니다 (선택)
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                이벤트, 혜택 등의 알림을 받을 수 있습니다
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 가입 버튼 */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={!isFormValid || isLoading}
                            >
                                {isLoading ? '가입 중...' : '가입 완료하기'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* 추가 정보 */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        이미 계정이 있으신가요?{' '}
                        <button
                            onClick={onBack}
                            className="text-primary hover:underline"
                        >
                            다시 선택하기
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
