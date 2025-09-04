import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import styled, { css } from 'styled-components/native';

type StrengthInfo = {
  level: 0 | 1 | 2 | 3 | 4;
  text: string;
  color: string;
};

type Props = {
  password: string;
};

const getStrength = (pass: string): StrengthInfo => {
  if (!pass) return { level: 0, text: 'Enter password', color: '#E5E7EB' };

  const checks = {
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    number: /\d/.test(pass),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score < 2) return { level: 1, text: 'Weak', color: '#EF4444' }; // red-500
  if (score < 4) return { level: 2, text: 'Fair', color: '#F59E0B' }; // amber-500
  if (score < 5) return { level: 3, text: 'Good', color: '#10B981' }; // emerald-500
  return { level: 4, text: 'Strong', color: '#059669' }; // emerald-600
};

const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const strength = useMemo(() => getStrength(password ?? ''), [password]);

  const requirements = useMemo(
    () => [
      { text: 'At least 8 characters', met: (password ?? '').length >= 8 },
      { text: 'One uppercase letter', met: /[A-Z]/.test(password ?? '') },
      { text: 'One number', met: /\d/.test(password ?? '') },
      {
        text: 'One special character',
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password ?? ''),
      },
    ],
    [password],
  );

  return (
    <Container>
      <BarsContainer>
        {[1, 2, 3, 4].map(level => (
          <Bar
            key={level}
            active={level <= strength.level}
            color={strength.color}
          />
        ))}
      </BarsContainer>

      {!!password && (
        <StrengthText color={strength.color}>
          Password strength: {strength.text}
        </StrengthText>
      )}

      <Requirements>
        {requirements.map((req, idx) => (
          <RequirementRow key={idx} met={req.met}>
            <RequirementIcon met={req.met}>
              {req.met ? <CheckMark /> : null}
            </RequirementIcon>
            <RequirementLabel met={req.met}>{req.text}</RequirementLabel>
          </RequirementRow>
        ))}
      </Requirements>
    </Container>
  );
};

const Container = styled.View`
  margin-top: 8px;
`;

const BarsContainer = styled.View`
  flex-direction: row;
  gap: 4px;
  margin-bottom: 8px;
`;

const Bar = styled.View<{ active: boolean; color: string }>`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background-color: #e5e7eb; /* gray-200 default */
  ${({ active, color }) =>
    active &&
    css`
      background-color: ${color};
    `}
`;

const StrengthText = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color};
  margin-bottom: 8px;
`;

const Requirements = styled.View``;

const RequirementRow = styled.View<{ met: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const RequirementIcon = styled.View<{ met: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ met }) =>
    met ? '#10B981' : '#6B7280'}; /* emerald-500 / gray-500 */
  background-color: ${({ met }) => (met ? '#10B981' : 'transparent')};
`;

const RequirementLabel = styled.Text<{ met: boolean }>`
  font-size: 12px;
  color: ${({ met }) => (met ? '#10B981' : '#6B7280')};
`;

const CheckMark = styled.View`
  width: 6px;
  height: 3px;
  border-left-width: 2px;
  border-bottom-width: 2px;
  border-color: white;
  transform: rotate(-45deg);
`;

export default PasswordStrengthMeter;
