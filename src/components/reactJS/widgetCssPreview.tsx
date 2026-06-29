import React from 'react';
import type { CollectionEntry } from 'astro:content';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

interface Props {
  project: CollectionEntry<'widgetCss'>;
}

const WidgetCssPreview: React.FC<Props> = ({ project }) => {
  const { data } = project;

  return (
    <Card className="border border-border w-full h-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-1 text-xs rounded-full bg-secondary/50">
            CSS Widget
          </span>
        </div>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{data.description}</p>
      </CardContent>
      <CardFooter>
        <a href={data.href}>
          <Button variant="outline" className="text-primary hover:text-primary-foreground hover:bg-primary">
            Try it
          </Button>
        </a>
      </CardFooter>
    </Card>

  );
};

export default WidgetCssPreview;