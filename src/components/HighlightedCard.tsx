import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';

export default function HighlightedCard() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <InsightsRoundedIcon />
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: '600' }}
        >
          Explore your data
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          Uncover performance and visitor insights with our data wizardry.
        </Typography>
      </CardContent>
    </Card>
  );
}