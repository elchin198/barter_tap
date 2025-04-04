
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash, Image, Link, ExternalLink } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface Advertisement {
  id: number;
  title: string;
  position: 'left' | 'right';
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

export default function Advertisements() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<Advertisement> | null>(null);

  // Mock data - will be replaced with real API calls
  const { data: advertisements = [], isLoading } = useQuery<Advertisement[]>({
    queryKey: ['/api/admin/advertisements'],
    // Comment out when API is ready
    placeholderData: [
      {
        id: 1,
        title: 'BarterTap Premium',
        position: 'left',
        imageUrl: '/assets/images/sample-ad1.jpg',
        linkUrl: 'https://bartertap.com/premium',
        active: true,
        startDate: '2023-10-01',
        endDate: '2023-12-31'
      },
      {
        id: 2,
        title: 'Special Offer',
        position: 'right',
        imageUrl: '/assets/images/sample-ad2.jpg',
        linkUrl: 'https://example.com/special',
        active: false,
        startDate: '2023-11-01',
        endDate: '2023-11-15'
      }
    ]
  });

  // Create/update advertisement mutation
  const mutation = useMutation({
    mutationFn: async (ad: Partial<Advertisement>) => {
      // Will be implemented when API is ready
      const url = ad.id 
        ? `/api/admin/advertisements/${ad.id}` 
        : '/api/admin/advertisements';

      const method = ad.id ? 'PUT' : 'POST';

      /*
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad)
      });

      if (!response.ok) {
        throw new Error('Failed to save advertisement');
      }

      return response.json();
      */

      // Mock implementation
      return { ...ad, id: ad.id || Date.now() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisements'] });
      toast({
        title: t('admin.advertisementSaved', 'Advertisement saved successfully'),
        description: t('admin.advertisementSavedDesc', 'Your changes have been applied'),
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: t('admin.advertisementError', 'Error saving advertisement'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete advertisement mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Will be implemented when API is ready
      /*
      const response = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete advertisement');
      }

      return response.json();
      */

      // Mock implementation
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisements'] });
      toast({
        title: t('admin.advertisementDeleted', 'Advertisement deleted'),
        description: t('admin.advertisementDeletedDesc', 'The advertisement has been removed'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.advertisementDeleteError', 'Error deleting advertisement'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleEdit = (ad: Advertisement) => {
    setCurrentAd(ad);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentAd({
      title: '',
      position: 'left',
      imageUrl: '',
      linkUrl: '',
      active: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(t('admin.confirmDeleteAd', 'Are you sure you want to delete this advertisement?'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAd) {
      mutation.mutate(currentAd);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {t('admin.advertisements', 'Advertisements')}
          </h1>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.addAdvertisement', 'Add Advertisement')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.manageAdvertisements', 'Manage Advertisements')}</CardTitle>
            <CardDescription>
              {t('admin.advertisementsDesc', 'Create and manage advertisements displayed on your website')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.advertisementTitle', 'Title')}</TableHead>
                    <TableHead>{t('admin.position', 'Position')}</TableHead>
                    <TableHead>{t('admin.active', 'Active')}</TableHead>
                    <TableHead>{t('admin.dateRange', 'Date Range')}</TableHead>
                    <TableHead className="text-right">{t('admin.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.title}</TableCell>
                      <TableCell>
                        {ad.position === 'left' 
                          ? t('admin.leftSide', 'Left Side') 
                          : t('admin.rightSide', 'Right Side')}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={ad.active}
                          onCheckedChange={(checked) => {
                            const updatedAd = { ...ad, active: checked };
                            mutation.mutate(updatedAd);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(ad)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDelete(ad.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {advertisements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {t('admin.noAdvertisements', 'No advertisements found. Create your first advertisement.')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {currentAd?.id 
                  ? t('admin.editAdvertisement', 'Edit Advertisement') 
                  : t('admin.newAdvertisement', 'New Advertisement')}
              </DialogTitle>
              <DialogDescription>
                {t('admin.advertisementDialogDesc', 'Fill in the details for your advertisement banner')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  {t('admin.title', 'Title')}
                </Label>
                <Input
                  id="title"
                  value={currentAd?.title || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, title: e.target.value })}
                  className="col-span-3"
                  placeholder={t('admin.advertisementTitlePlaceholder', 'Enter advertisement title')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  {t('admin.position', 'Position')}
                </Label>
                <div className="col-span-3 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="position-left"
                      name="position"
                      value="left"
                      checked={currentAd?.position === 'left'}
                      onChange={() => setCurrentAd({ ...currentAd, position: 'left' })}
                    />
                    <Label htmlFor="position-left">
                      {t('admin.leftSide', 'Left Side')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="position-right"
                      name="position"
                      value="right"
                      checked={currentAd?.position === 'right'}
                      onChange={() => setCurrentAd({ ...currentAd, position: 'right' })}
                    />
                    <Label htmlFor="position-right">
                      {t('admin.rightSide', 'Right Side')}
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  {t('admin.imageUrl', 'Image URL')}
                </Label>
                <Input
                  id="imageUrl"
                  value={currentAd?.imageUrl || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })}
                  className="col-span-3"
                  placeholder={t('admin.imageUrlPlaceholder', 'Enter image URL')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkUrl" className="text-right">
                  {t('admin.linkUrl', 'Link URL')}
                </Label>
                <Input
                  id="linkUrl"
                  value={currentAd?.linkUrl || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, linkUrl: e.target.value })}
                  className="col-span-3"
                  placeholder={t('admin.linkUrlPlaceholder', 'Enter destination URL')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  {t('admin.startDate', 'Start Date')}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={currentAd?.startDate || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, startDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  {t('admin.endDate', 'End Date')}
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={currentAd?.endDate || ''}
                  onChange={(e) => setCurrentAd({ ...currentAd, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  {t('admin.active', 'Active')}
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={currentAd?.active || false}
                    onCheckedChange={(checked) => setCurrentAd({ ...currentAd, active: !!checked })}
                  />
                  <Label htmlFor="active">
                    {t('admin.showAdvertisement', 'Show this advertisement')}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.saving', 'Saving...')}
                  </div>
                ) : (
                  t('common.save', 'Save')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
