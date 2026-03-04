import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useGamification } from '../../context/GamificationContext';

export const OperatingScore: React.FC = () => {
    const { state } = useGamification();
    const osRaw = state.profile?.current_os || 0;
    const os = Math.round(osRaw * 10) / 10;
    const profileId = state.profile?.id;

    // Kpi Levels & Colors mapped to M3 Tokens
    const getKpiData = (val: number) => {
        if (val < 40) return { label: 'Yếu', color: 'var(--md-sys-color-error)' };
        if (val < 60) return { label: 'Trung Bình', color: 'var(--md-sys-color-tertiary)' };
        if (val < 80) return { label: 'Tốt', color: 'var(--md-sys-color-secondary)' };
        if (val < 90) return { label: 'Xuất sắc', color: 'var(--md-sys-color-primary)' };
        return { label: 'Hoàn hảo', color: 'var(--md-sys-color-primary)' };
    };

    const kpiData = getKpiData(os);

    // Calculate Lead Stats for the active user
    const myLeads = state.leads.filter(l => l.pic_id === profileId);
    const countNegotiating = myLeads.filter(l => l.status === 'Đang thương lượng').length;
    const countSuccess = myLeads.filter(l => l.status === 'Thành công').length;
    const countFailed = myLeads.filter(l => l.status === 'Thất bại').length;

    // SVG Gauge parameters
    const size = 180;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2 + 10;
    const dashArray = Math.PI * radius; // Circumference of semi-circle
    const dashOffset = dashArray - (dashArray * Math.min(100, os)) / 100;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                pt: 2.5,
                pb: 2.5,
                borderRadius: 4,
                backgroundColor: 'var(--md-sys-color-surface-variant)',
            }}
        >
            <Typography variant="subtitle1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold', mb: 3 }}>
                Tổng quan KPI
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Left Side: Gauge Chart */}
                <Box sx={{ position: 'relative', width: size, height: size / 2 + strokeWidth, display: 'flex', justifyContent: 'center' }}>
                    <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
                        {/* Background Arc */}
                        <path
                            d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
                            fill="none"
                            stroke="var(--md-sys-color-surface)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                        {/* Foreground Progress Arc */}
                        <path
                            d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
                            fill="none"
                            stroke={kpiData.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease-in-out' }}
                        />
                    </svg>

                    {/* Centered Score */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: strokeWidth - 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: '900', fontSize: '2.5rem', lineHeight: 1 }}>
                            {Number.isInteger(os) ? os : os.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-outline)', fontWeight: '500', mt: 0.5 }}>
                            Điểm Vận Hành
                        </Typography>
                    </Box>
                </Box>

                {/* Right Side: Lead Stats List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 120 }}>
                    {/* Đàm phán */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 6, height: 16, borderRadius: 3, backgroundColor: 'var(--md-sys-color-tertiary)' }} />
                        <Typography sx={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--md-sys-color-on-surface)', minWidth: 28 }}>
                            {countNegotiating}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Đàm phán
                        </Typography>
                    </Box>

                    {/* Thành công */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 6, height: 16, borderRadius: 3, backgroundColor: 'var(--md-sys-color-primary)' }} />
                        <Typography sx={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--md-sys-color-on-surface)', minWidth: 28 }}>
                            {countSuccess}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Thành công
                        </Typography>
                    </Box>

                    {/* Thất bại */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 6, height: 16, borderRadius: 3, backgroundColor: 'var(--md-sys-color-error)' }} />
                        <Typography sx={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--md-sys-color-on-surface)', minWidth: 28 }}>
                            {countFailed}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Thất bại
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};


